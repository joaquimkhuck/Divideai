# Entrega de quinta: o que é do grupo e o que é de cada um

Entrega **individual** no Canvas, mas o app é um só. Então quase tudo já está feito e é compartilhado: cada um submete o mesmo documento e os mesmos links. A única parte que é genuinamente individual é o print do PostHog, porque ele tem que mostrar a **sua** visita.

## Já está pronto e no ar (não precisa fazer nada)

| Entregável | Estado |
|---|---|
| 1. Title, meta description e H1 | Escritos e aplicados em https://divideai.pangeia.cloud. Confira com `curl -s https://divideai.pangeia.cloud/ \| head -20` |
| 2. Os três links | `/robots.txt`, `/sitemap.xml` e `/llms.txt` respondendo em produção |
| 3. As 5 features com score | Tabela RICE pronta, com fonte no repositório para cada linha |
| 4. PostHog | Conta criada, código no app publicado, eventos chegando |

O documento completo é `docs/entregavel-seo-geo.md`, neste repositório.

## O que cada um faz, individualmente (10 minutos)

**Passo 1. Aceitar o convite do PostHog.** Vai chegar um convite por e-mail para o projeto `Default project` (nuvem dos EUA). Aceite e entre em https://us.posthog.com.

**Passo 2. Gerar a sua visita.** Abra https://divideai.pangeia.cloud no seu navegador, no celular ou no computador, e navegue por duas ou três telas: home, rolês anteriores, e volte. Isso registra pageviews com o **seu** navegador, que é o que o print precisa mostrar.

Se você usa bloqueador de anúncio, não precisa desligar: o app manda os eventos pelo próprio domínio (`divideai.pangeia.cloud/ingest`) justamente para não ser cortado. Esse foi um dos achados do trabalho.

**Passo 3. Tirar o print.** No PostHog, vá em **Activity**. Espere uns 30 segundos e recarregue. Você vai ver linhas de `Pageview` com a URL `https://divideai.pangeia.cloud/...` e library `web`. Print dessa tela.

**Passo 4. Submeter no Canvas.** O documento (exportado em PDF ou colado direto) mais o seu print.

## Se o professor perguntar quem fez o quê

O trabalho de SEO e GEO foi feito em cima do app que os três construíram. Os quatro itens da entrega são de grupo por definição, já que existe um site só, um domínio só e um projeto de analytics só. O que dá para dizer com honestidade em cada entrega individual é o que cada um consegue explicar, e para isso o documento traz o porquê de cada decisão, não só o resultado.

## Os três pontos que rendem pergunta em sala

Vale cada um ter lido, porque são os achados de verdade do trabalho, e não "fizemos o que foi pedido":

1. **`sitemap.xml` e `llms.txt` respondiam HTTP 200 antes de existirem.** O servidor entrega o `index.html` para qualquer caminho desconhecido, que é como uma SPA funciona. Checar por status code diria que estava tudo certo.

2. **O H1 não existia para quem não roda JavaScript.** O app é React: o HTML servido era `<div id="root"></div>`. Googlebot renderiza JavaScript e veria; GPTBot e PerplexityBot, que alimentam busca generativa, não renderizam. Por isso o H1 foi colocado também no HTML estático.

3. **O PostHog inicializava e não registrava nada.** Bloqueador de rastreador no navegador cortava só a chamada de captura (`Failed to fetch`), enquanto a mesma chamada pelo terminal voltava `200 Ok`. Resolvido com proxy reverso no nosso domínio. Sem isso, entre 15% e 30% dos acessos em desktop sumiriam da métrica, sem nenhum erro avisando.
