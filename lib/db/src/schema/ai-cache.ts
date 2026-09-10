import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Cache das extrações da IA, chaveado pelo sha256 do base64 da imagem.
 *
 * Sem FK para `bills` de propósito: a extração acontece em `POST /bills/analyze`,
 * que é anterior a qualquer conta e na maioria das vezes nunca vira uma.
 * `hits` conta quantas chamadas de API foram evitadas por esta linha.
 */
export const aiExtractionCacheTable = pgTable("ai_extraction_cache", {
  id: serial("id").primaryKey(),
  imageHash: text("image_hash").notNull().unique(),
  result: jsonb("result").notNull(),
  model: text("model").notNull().default(""),
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  hits: integer("hits").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AiExtractionCacheRow = typeof aiExtractionCacheTable.$inferSelect;
