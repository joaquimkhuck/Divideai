import Anthropic from "@anthropic-ai/sdk";

// Leitura da conta: Gemini é o principal; o Claude entra de reserva quando o
// Gemini falha (503 de demanda alta e 429 de cota apareceram nos testes).
const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const anthropicKey = process.env.ANTHROPIC_API_KEY_2;
const GEMINI_TIMEOUT_MS = 20_000;

export class BillReadError extends Error {}

export interface ExtractedBill {
  restaurantName: string | null;
  items: { description: string; quantity: number; unitPriceCents: number }[];
  serviceFeePercent: number;
  couvertCents: number;
  detectedTotalCents: number | null;
}

const PROMPT = `Você lê fotos de comandas/contas de restaurantes brasileiros.
Extraia os dados e responda SOMENTE com JSON válido, sem markdown, no formato:
{
  "restaurantName": string | null,
  "items": [{ "description": string, "quantity": number, "unitPriceCents": number }],
  "serviceFeePercent": number,
  "serviceFeeCents": number,
  "couvertCents": number,
  "detectedTotalCents": number | null
}
Regras:
- Todos os valores monetários em CENTAVOS inteiros (R$ 12,50 -> 1250).
- "unitPriceCents" é o preço UNITÁRIO; se a conta mostrar só o total da linha, divida pelo quantity.
- "serviceFeePercent": taxa de serviço/gorjeta em % quando a conta imprime a porcentagem (ex.: "Serviço 10%" -> 10). Se não houver, 0. NÃO inclua a taxa como item.
- "serviceFeeCents": valor em centavos de qualquer cobrança somada por cima dos itens que NÃO seja couvert: taxa de serviço, gorjeta, imposto (tax, IVA), acréscimo. Uma cobrança nunca entra nos dois campos: se a porcentagem dela estiver impressa, vai em "serviceFeePercent"; se só o valor estiver impresso, vai aqui. Várias cobranças só em valor (ex.: serviço e imposto): some aqui. Se não houver, 0. NÃO inclua como item.
- "couvertCents": só o que estiver escrito como couvert, couvert artístico ou entrada; senão 0. Taxa de serviço e imposto NUNCA vão aqui. NÃO inclua como item.
- "detectedTotalCents": total final impresso na conta, se legível; senão null.
- Se a imagem NÃO for uma conta/comanda legível, responda: {"error":"unreadable"}`;

async function readWithGemini(mimeType: string, data: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": geminiKey! },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ inline_data: { mime_type: mimeType, data } }, { text: PROMPT }],
          },
        ],
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      }),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    },
  );
  if (!response.ok) {
    throw new Error(`Gemini ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  const body = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return (body.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
}

async function readWithClaude(mimeType: string, data: string): Promise<string> {
  const client = new Anthropic({ apiKey: anthropicKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
              data,
            },
          },
          { type: "text", text: PROMPT },
        ],
      },
    ],
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export async function analyzeBillImage(
  imageBase64: string,
): Promise<ExtractedBill> {
  if (!geminiKey && !anthropicKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const match = imageBase64.match(/^data:(image\/\w+);base64,(.*)$/s);
  const mimeType = match?.[1] ?? "image/jpeg";
  const data = match?.[2] ?? imageBase64;

  let raw: string;
  if (geminiKey) {
    try {
      raw = await readWithGemini(mimeType, data);
    } catch (err) {
      if (!anthropicKey) throw err;
      console.warn("Gemini falhou, lendo com Claude:", String(err).slice(0, 160));
      raw = await readWithClaude(mimeType, data);
    }
  } else {
    raw = await readWithClaude(mimeType, data);
  }
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new BillReadError("AI returned invalid JSON");
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.error === "unreadable" || !Array.isArray(obj.items) || obj.items.length === 0) {
    throw new BillReadError("unreadable");
  }

  const items = (obj.items as Record<string, unknown>[])
    .map((it) => ({
      description: String(it.description ?? "").trim(),
      quantity: Math.max(1, Math.round(Number(it.quantity) || 1)),
      unitPriceCents: Math.max(0, Math.round(Number(it.unitPriceCents) || 0)),
    }))
    .filter((it) => it.description.length > 0);

  if (items.length === 0) throw new BillReadError("unreadable");

  // Taxa impressa só em reais vira porcentagem sobre a mesma base do split
  // (itens + couvert), para ser rateada na proporção do consumo.
  const couvertCents = Math.max(0, Math.round(Number(obj.couvertCents) || 0));
  let serviceFeePercent = Math.max(0, Number(obj.serviceFeePercent) || 0);
  const serviceFeeCents = Math.max(0, Math.round(Number(obj.serviceFeeCents) || 0));
  const baseCents =
    items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0) + couvertCents;
  // Se o modelo preencheu os dois campos com a mesma cobrança (visto no teste
  // do flash-lite: 10% e o valor dos 10%), o valor em reais é duplicata.
  const cobrancaDuplicada =
    serviceFeePercent > 0 &&
    Math.abs(serviceFeeCents - (baseCents * serviceFeePercent) / 100) <= 2;
  if (serviceFeeCents > 0 && baseCents > 0 && !cobrancaDuplicada) {
    serviceFeePercent = Math.min(
      100,
      Math.round((serviceFeePercent + (serviceFeeCents / baseCents) * 100) * 10_000) / 10_000,
    );
  }

  return {
    restaurantName:
      typeof obj.restaurantName === "string" && obj.restaurantName.trim()
        ? obj.restaurantName.trim()
        : null,
    items,
    serviceFeePercent,
    couvertCents,
    detectedTotalCents:
      obj.detectedTotalCents == null
        ? null
        : Math.max(0, Math.round(Number(obj.detectedTotalCents) || 0)),
  };
}
