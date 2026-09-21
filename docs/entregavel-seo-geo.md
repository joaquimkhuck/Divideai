# Divide Aí: entregável de SEO e GEO

Aplicativo: https://divideai.pangeia.cloud
Repositório: github.com/joaquimkhuck/Divideai
Time: Joaquim Huck, Estevão Antunes, Artur Bresser

---

## 1. O documento: title, meta description e H1

### O que escrevemos

**Title** (51 caracteres)

```
Divide Aí: divida a conta do restaurante pela foto
```

**Meta description** (155 caracteres)

```
Fotografe a conta do restaurante e o Divide Aí separa quem comeu o quê. Cada um paga só o que consumiu, com taxa e couvert no cálculo, e a soma sempre fecha.
```

**H1**

```
Divida a conta do restaurante pela foto
```

### Por que assim

O que estava no ar antes era o texto que o Replit gera sozinho: `<title>Divide Aí</title>` e a description `"Divide Aí — built on Replit. Update this description to reflect the app."`. Ou seja, a página se apresentava pelo nome da ferramenta que a construiu, não pelo problema que resolve. E não existia H1 nenhum.

As três peças foram escritas com a mesma intenção e sem repetir palavra à toa:

- **Title**: marca na frente porque "Divide Aí" é o termo que alguém digita quando já ouviu falar do app, e a promessa logo depois porque quem ainda não ouviu busca pela dor ("dividir conta restaurante"). Cabe nos 60 caracteres que o Google mostra, então não é cortado com reticências.
- **Meta description**: não é fator de ranqueamento, é anúncio. Ela existe para ganhar o clique de quem já viu o resultado, então carrega o diferencial que o concorrente não tem (taxa de serviço e couvert rateados, e a soma que fecha) em vez de repetir o title.
- **H1**: descritivo, com a intenção de busca inteira em cinco palavras. Não usamos a marca como H1 porque "Divide Aí" não diz nada a quem chega de uma busca por "como dividir a conta do rodízio".

### Onde está aplicado

| Peça | Arquivo | Evidência |
|---|---|---|
| Title, meta description, canonical, Open Graph, `lang="pt-BR"` | `artifacts/divide-ai/index.html` | `curl -s https://divideai.pangeia.cloud/ \| grep -i "<title>\|description"` |
| H1 na tela | `artifacts/divide-ai/src/pages/home.tsx` | visível na home, abaixo do visor da câmera |
| H1 no HTML servido | `artifacts/divide-ai/index.html` | `curl -s https://divideai.pangeia.cloud/ \| grep "<h1"` |

### O detalhe que a aula de GEO expõe

O Divide Aí é uma SPA em React. O HTML que o servidor entrega é praticamente `<div id="root"></div>`: o conteúdo só nasce depois que o JavaScript roda. O Googlebot renderiza JavaScript e enxergaria o H1 mesmo assim, mas os crawlers que alimentam busca generativa em geral não renderizam: GPTBot, PerplexityBot e ClaudeBot leem o HTML cru. Para eles, a home não tinha H1 nem texto, e o app simplesmente não existia como resposta possível.

Por isso o H1 e a frase de apoio foram colocados também dentro do `#root` no HTML estático. O React substitui esse bloco quando monta, então o usuário não vê diferença, e quem lê sem executar JavaScript passa a receber a página com conteúdo. É a diferença entre estar indexável e ser citável.

---

## 2. Os links

| Arquivo | URL | Situação antes |
|---|---|---|
| robots.txt | https://divideai.pangeia.cloud/robots.txt | Existia, com três linhas genéricas e nenhuma referência ao sitemap |
| sitemap.xml | https://divideai.pangeia.cloud/sitemap.xml | Não existia. A URL devolvia HTTP 200 com o `index.html`, por causa do fallback de SPA do Caddy |
| llms.txt | https://divideai.pangeia.cloud/llms.txt | Não existia, mesmo caso |

O detalhe do fallback vale registrar: como o servidor responde `index.html` para qualquer caminho desconhecido, os dois arquivos ausentes retornavam 200 em vez de 404. Uma verificação por status code diria que estava tudo certo. Só olhando o corpo da resposta dá para ver que não existiam.

### robots.txt

Escolha central: a única página com conteúdo público é a home. O resto (`/revisar`, `/quem-comeu`, `/role/:id`, `/perfil`, `/creditos`, `/pagamento/`) são telas de aplicação, com dado de sessão e nada de indexável. Elas estão bloqueadas, e não por preciosismo: página de app sem conteúdo próprio diluiria o que o buscador entende como sendo o site.

Os crawlers de IA aparecem nomeados e liberados de propósito (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, Applebot-Extended). Essa é a decisão de GEO do projeto: queremos que o app possa ser citado como resposta quando alguém perguntar ao ChatGPT como dividir a conta do restaurante. `/api/` está bloqueado para todos.

O arquivo termina apontando o sitemap, que é como o crawler o encontra sem depender do Search Console.

### sitemap.xml

Duas URLs: a home (prioridade 1.0) e `/entrar`. Poderíamos ter listado as quinze rotas do app para o arquivo parecer robusto, mas sitemap não é inventário de rotas, é declaração do que merece ser indexado. Listar tela de fluxo contradiria o próprio robots.txt.

### llms.txt

É o formato proposto em llms.txt.org para dar ao modelo de linguagem uma versão limpa do que o site é, em Markdown, sem menu nem JavaScript. Enquanto o sitemap responde "quais páginas existem", o llms.txt responde "o que este produto é e o que é verdade sobre ele".

O nosso carrega os fatos que um modelo precisa para responder sobre o app sem errar:

- o fluxo em cinco passos, de foto até cobrança;
- que item compartilhado é dividido em centavos inteiros, com diferença máxima de um centavo entre as partes;
- que taxa de serviço e couvert são rateados na proporção do consumo, pelo método do maior resto, e não em partes iguais;
- que a soma dos valores individuais sempre fecha com o total;
- que só a leitura da foto consome crédito;
- e, deliberadamente, o que o produto **não** é: não é vaquinha nem controle de despesa recorrente.

Essa última linha existe porque a falha típica de um modelo é aproximar o produto do vizinho mais famoso. Dizer o que ele não é reduz a chance de ele ser descrito errado.

---

## 3. As próximas 5 features com score

> Pendente: aplicar o framework de priorização dado em aula sobre as candidatas levantadas.

---

## 4. A conta do PostHog

Conta criada em posthog.com (login por GitHub), projeto na nuvem dos Estados Unidos.

O código está no app publicado: `posthog-js` inicializado em `artifacts/divide-ai/src/main.tsx`, com a configuração isolada em `artifacts/divide-ai/src/lib/analytics.ts`. A captura de pageview usa o pacote de defaults `2025-05-24`, que registra navegação por History API. Isso importa aqui porque a aplicação é uma SPA com wouter: sem isso, o PostHog contaria uma única visita e ignoraria toda a troca de telas dentro do fluxo.

O token de projeto (`phc_...`) fica no código do cliente porque é público por definição: ele só permite escrever evento, nunca ler dado. As chaves que não podem vazar (Anthropic, Stripe, Clerk) continuam apenas nas variáveis de ambiente do servidor.

**Evidência**: `docs/evidencias/posthog-eventos.jpg`, painel com os eventos `Pageview` e `Pageleave` vindos de `divideai.pangeia.cloud`, library `web`.

### O bloqueador de rastreador: o erro que quase passou batido

Na primeira versão, o app chamava `us.i.posthog.com` direto, como manda a documentação. O código estava certo, a chave estava certa, o PostHog inicializava no navegador (sessão criada, configuração remota carregada) e mesmo assim o painel continuava com zero evento.

O que o teste mostrou:

| Chamada | Pelo terminal | Pelo navegador |
|---|---|---|
| `POST us.i.posthog.com/i/v0/e/` (captura) | `200 {"status":"Ok"}` | `Failed to fetch` |
| `POST us.i.posthog.com/decide/` | 200 | 200 |
| `GET us-assets.i.posthog.com/.../config.js` | 200 | 200 |

Ou seja: o bloqueador de rastreador instalado no navegador deixava passar a configuração e cortava só a captura. Do lado do servidor estava tudo funcionando, e nenhum erro aparecia no console.

A correção é a que o próprio PostHog recomenda: um proxy reverso no nosso domínio. O Caddy passou a repassar `divideai.pangeia.cloud/ingest` para a nuvem do PostHog, e o cliente aponta para `/ingest`. Como a requisição sai da mesma origem do site, não existe domínio de terceiro para a lista de bloqueio reconhecer.

Depois da mudança, o `$pageview` disparado pelo próprio posthog-js aparece na aba de rede como `POST /ingest/i/v0/e/` com status 200, e os eventos aparecem no painel.

Isso não é detalhe de bastidor: entre 15% e 30% dos acessos em desktop têm bloqueador. Sem o proxy, o produto teria uma métrica sistematicamente menor que a realidade, sem nenhum sinal de erro avisando.

### Por que isso era o buraco mais sério do projeto

O PRD define três métricas de acompanhamento: tempo da foto até o valor por pessoa, porcentagem de itens que não precisaram de correção e porcentagem de contas que chegam até o pagamento. Nenhuma delas tinha um único evento instrumentado no código. Com analytics no ar, a próxima priorização deixa de ser palpite.

---

## Validação técnica

- `pnpm --filter @workspace/divide-ai run typecheck`: sem erros
- `pnpm --filter @workspace/divide-ai run build`: build de produção concluído, com `robots.txt`, `sitemap.xml` e `llms.txt` presentes em `dist/public`
- Deploy no Coolify a partir da `main`, em https://divideai.pangeia.cloud
- Verificação em produção: title, meta description, canonical e `lang="pt-BR"` no HTML servido; H1 presente no HTML cru (sem executar JavaScript); os três arquivos respondendo 200 com o content-type correto (`text/plain` e `text/xml`); `posthog-js` no bundle e evento chegando ao painel
