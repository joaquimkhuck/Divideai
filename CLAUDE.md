# Divide Aí

Dividir a conta do restaurante por consumo, a partir de uma foto.
Fluxo core: foto da conta > IA extrai itens > grupo atribui itens a pessoas > valor por pessoa > cobrança via Pix.

Time: Estevão Antunes, Joaquim Huck, Artur Bresser.

## Fontes de verdade (ler antes de mudar código)

- `README.md`: visão do produto, estrutura do monorepo, motor de cálculo, modelo de dados
- `replit.md`: comandos de run/operate, stack, mapa do repo
- `attached_assets/PRD-divide-ai-v1_*.md`: PRD
- Design system: `artifacts/divide-ai-ds/DESIGN.md` + `tokens.json`

## Comandos essenciais

```bash
pnpm --filter @workspace/api-server run dev   # API usa a variável PORT
pnpm run typecheck                            # typecheck completo
pnpm run build                                # typecheck + build
pnpm --filter @workspace/api-spec run codegen # regenera hooks e Zod do OpenAPI
pnpm --filter @workspace/db run push          # push de schema (dev only)
```

## Regras do repo

- pnpm SEMPRE (npm/yarn são bloqueados no preinstall)
- Nunca editar arquivos gerados à mão: `divide-ai-ds/src/index.css`, `src/generated/tokens.tsx`, output do Orval
- Contratos de API mudam no OpenAPI spec primeiro, depois `codegen`
- Zod via `zod/v4`
- Env obrigatória: `DATABASE_URL` (Postgres)

## Onboarding com Claude Code

Novo no repo? Instale o Claude Code e pergunte ao código em vez de ler tudo:

```bash
npm install -g @anthropic-ai/claude-code
cd Divideai && claude
```

O código não é indexado nem enviado pra lugar nenhum além da chamada de API, e não treina modelo. Funciona no primeiro dia, sem setup.

Prompts que funcionam bem aqui:

- Como funciona o fluxo da foto da conta até o valor por pessoa? Me mostra os arquivos envolvidos na ordem.
- Onde o motor de cálculo garante que a soma dos valores individuais fecha com o total? Explica o tratamento de centavos.
- Como a sessão anônima via cookie funciona? O que acontece quando o usuário cria conta depois?
- Por que esse endpoint foi feito assim? Olha o git history e as mensagens de commit antes de responder.
- O que mudou no repo na última semana e por quê? Resume por autor.
- Quero adicionar um campo novo no item da conta. Me lista tudo que precisa mudar: schema Drizzle, OpenAPI, codegen, UI.

Regra de ouro: pergunta "por quê" com git history antes de refatorar qualquer coisa que pareça estranha. Geralmente tem motivo.
