# Divide Aí na App Store: plano paralelo

17/09/2026. Plano paralelo à versão web, que continua sendo a principal. Nada aqui bloqueia o web.

## Rota escolhida

Empacotar o front atual (`artifacts/divide-ai`, React + Vite) com **Capacitor**, mantendo a API no Replit. É a rota com menos código novo, e o Estevão já usou Capacitor no iOS da BODYBASE.

A alternativa, reescrever em Swift ou React Native, só se justifica se a Apple recusar o app empacotado.

## Travas achadas no código (o que quebra hoje dentro do app iOS)

| # | Trava | Onde | Por que quebra | Correção |
|---|---|---|---|---|
| T1 | Identidade anônima por cookie | `api-server/src/middlewares/owner.ts` (`sameSite: lax`) e `app.ts` (`cors()` sem credentials) | No Capacitor o front roda em `capacitor://localhost` e a API em outro domínio. O cookie é de terceiro, o WKWebView não guarda, e cada request vira um dono novo: as contas somem. | Aceitar também o header `X-Owner-Token`. O app gera o UUID uma vez, guarda no Preferences e envia em todo request. O cookie continua valendo no web. |
| T2 | Login Google dentro de WebView | `pages/entrar.tsx` (Clerk) | O Google bloqueia OAuth em WebView embutida (`disallowed_useragent`). | Fazer o OAuth pelo navegador do sistema (ASWebAuthenticationSession) e voltar ao app por deep link. |
| T3 | Checkout do Stripe | `pages/role.tsx:103` (`window.location.assign(url)`) | O app navega para fora do bundle, e o `/pagamento/sucesso` não volta para o app. | Abrir o checkout com `@capacitor/browser` e usar `success_url` como universal link ou deep link `divideai://pagamento/sucesso`. |
| T4 | Câmera | `pages/home.tsx:38` (`getUserMedia`) | Funciona no WKWebView (iOS 14.3+), mas exige `NSCameraUsageDescription` no Info.plist, senão o app fecha. | Adicionar a string de permissão. Usar `@capacitor/camera` também conta como recurso nativo (ver R1). |
| T5 | Cold start do Replit | deploy da API | O revisor da Apple abre o app, a API demora de 10 a 30 s e ele recusa por bug. | Deploy sempre ligado (Reserved VM ou Railway) antes de enviar para revisão. |

## Regras da Apple que pesam (conferir o texto atual das diretrizes antes de enviar)

| # | Regra | Impacto no Divide Aí | Decisão proposta |
|---|---|---|---|
| R1 | 4.2, funcionalidade mínima | Site empacotado costuma ser recusado. | Recursos nativos de verdade: câmera nativa, share sheet para mandar a cobrança, haptics ao fechar a conta. |
| R2 | 4.8, login de terceiros | Com login Google, o app precisa oferecer uma opção de login que proteja a privacidade. | Adicionar **Sign in with Apple** no Clerk. |
| R3 | 5.1.1(v), apagar conta | Se o app permite criar conta, precisa permitir apagá-la dentro do app. | Botão "apagar conta" que remove o usuário no Clerk e as contas do `clerk:<id>`. |
| R4 | 3.1.1, compra dentro do app | Os créditos (R$1 por conta, M3 do PRD) são conteúdo digital e teriam de passar pelo IAP. | **v1 do iOS sem créditos**: tudo grátis e nenhum IAP. Os créditos entram depois, via StoreKit ou RevenueCat. |
| R5 | 3.1.3(e), bens e serviços fora do app | Pagar a própria parte de uma conta de restaurante é pagamento de serviço do mundo real. | O Stripe Checkout e o Pix continuam fora do IAP. Deixar isso claro na nota para o revisor. |
| R6 | 5.1.2, dados enviados a IA de terceiros | A foto da conta vai para a Anthropic. | Tela de consentimento antes da primeira foto, citando a Anthropic, e a mesma informação na política de privacidade e no rótulo de privacidade. |
| R7 | 2.1, completude | O revisor precisa conseguir testar tudo. | Conta demo, foto de conta de exemplo e cartão de teste do Stripe na nota de revisão. |

## Decisões que são do time

1. **Qual conta Apple Developer?** Hoje o Awokn está na conta da BODYBASE, e o Estevão saiu da empresa. Opções: conta individual de um dos três (US$99 por ano, e o nome da pessoa aparece como vendedor) ou conta de empresa (exige CNPJ e D-U-N-S, o que leva semanas).
2. **Créditos no iOS:** fora da v1 (recomendado) ou com IAP desde o começo.
3. **Nome na loja:** a palavra-chave vem antes da marca, por exemplo "Dividir Conta: Divide Aí". Validar os termos no Apple Search Ads (grátis) do storefront Brasil: "dividir conta", "rachar conta", "dividir conta restaurante", "calculadora de gorjeta".

## Fases

Cada fase tem um critério de pronto que dá para verificar.

**F0. Contas e decisões (0,5 dia)**
- Resolver as decisões 1 a 3, criar o bundle id `br.divideai.app` e reservar o nome no App Store Connect.
- Pronto quando: o app aparece criado no App Store Connect.

**F1. Backend pronto para app (1 a 2 dias)**
- T1: header `X-Owner-Token` na API e no client gerado (OpenAPI → codegen).
- T5: deploy sempre ligado.
- R3: endpoint para apagar a conta.
- Pronto quando: um `curl` com o header cria uma conta e lista só as contas daquele token, e o fluxo web continua passando com cookie.

**F2. Casca Capacitor (1 a 2 dias)**
- Criar `artifacts/divide-ai-ios` (ou `ios/` dentro de `divide-ai`) com o `cap add ios` apontando para o `dist` do Vite, `base` = `/`.
- T4: permissão de câmera. R1: `@capacitor/camera`, `@capacitor/share` e `@capacitor/haptics`.
- Pronto quando: no simulador e num iPhone real o fluxo foto → itens → pessoas → valor por pessoa fecha sem erro.

**F3. Login e pagamento nativos (2 dias)**
- T2: OAuth pelo navegador do sistema. R2: Sign in with Apple. T3: checkout no Browser, com retorno por deep link.
- Pronto quando: login Google e login Apple completam no iPhone real, e um pagamento com o cartão 4242 volta para a tela de sucesso dentro do app.

**F4. Privacidade e ficha da loja (2 a 3 dias)**
- R6: tela de consentimento de IA.
- Política de privacidade e termos em URL pública, rótulos de privacidade (fotos, identificadores, dados de compra) e classificação etária.
- Screenshots com a UI real (a primeira mostra a foto virando itens), subtítulo e as 100 letras do campo de keywords.
- Pronto quando: o App Store Connect não acusa nenhum campo obrigatório vazio.

**F5. TestFlight e beta (1 semana corrida)**
- Build pelo Xcode e TestFlight interno para o time, depois externo para 10 a 20 pessoas.
- Repetir o teste do PRD: 5 refeições reais, das quais 4 chegam ao valor por pessoa em até 3 minutos.
- Instalar analytics (PostHog) antes do beta.
- Pronto quando: a build instala pelo TestFlight num iPhone de fora do time e as 5 refeições foram registradas.

**F6. Envio e lançamento**
- Nota para o revisor (R5, R7), enviar e responder a recusa em até 24 h, se houver.
- Lançar só quando o beta mostrar retenção. O impulso de visibilidade da Apple nas primeiras 2 semanas acontece uma vez só.
- Pronto quando: o app está "Ready for Distribution", com o link público testado.

Estimativa: de 8 a 11 dias de trabalho, mais a semana de beta e o tempo de revisão. As fases F1 a F3 podem rodar em paralelo, com uma pessoa no backend e outra na casca.

## Fora deste plano

Android, widget, créditos e IAP, e versão para restaurante.
