import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY_DIVIDE_AI;

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
  "couvertCents": number,
  "detectedTotalCents": number | null
}
Regras:
- Todos os valores monetários em CENTAVOS inteiros (R$ 12,50 -> 1250).
- "unitPriceCents" é o preço UNITÁRIO; se a conta mostrar só o total da linha, divida pelo quantity.
- "serviceFeePercent": taxa de serviço/gorjeta em % (ex.: 10). Se não houver, 0. NÃO inclua a taxa como item.
- "couvertCents": total de couvert/entrada, se houver; senão 0. NÃO inclua como item.
- "detectedTotalCents": total final impresso na conta, se legível; senão null.
- Se a imagem NÃO for uma conta/comanda legível, responda: {"error":"unreadable"}`;

export async function analyzeBillImage(
  imageBase64: string,
): Promise<ExtractedBill> {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY_DIVIDE_AI is not configured");
  }
  const client = new Anthropic({ apiKey });

  const match = imageBase64.match(/^data:(image\/\w+);base64,(.*)$/s);
  const mediaType = (match?.[1] ?? "image/jpeg") as
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/gif";
  const data = match?.[2] ?? imageBase64;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data } },
          { type: "text", text: PROMPT },
        ],
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
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

  return {
    restaurantName:
      typeof obj.restaurantName === "string" && obj.restaurantName.trim()
        ? obj.restaurantName.trim()
        : null,
    items,
    serviceFeePercent: Number(obj.serviceFeePercent) || 0,
    couvertCents: Math.max(0, Math.round(Number(obj.couvertCents) || 0)),
    detectedTotalCents:
      obj.detectedTotalCents == null
        ? null
        : Math.max(0, Math.round(Number(obj.detectedTotalCents) || 0)),
  };
}
