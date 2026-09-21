# Divide Aí: entregável de SEO e GEO

Aplicativo: https://divideai.pangeia.cloud
Repositório: github.com/joaquimkhuck/Divideai
Time: Joaquim Huck, Estevão Antunes, Artur Bresser

---

## 1. O documento: title, meta description e H1

### O que escrevemos

**Title** (50 caracteres)

```
Divide Aí: divida a conta do restaurante pela foto
```

**Meta description** (150 caracteres)

```
Fotografe a conta do restaurante e o Divide Aí separa quem comeu o quê. Cada um paga só o que consumiu, com taxa e couvert no cálculo, e a soma fecha.
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

### O framework

**RICE**: `(Reach × Impact × Confidence) ÷ Effort`. As unidades foram fixadas antes de pontuar qualquer coisa, senão o score vira opinião com cara de número:

- **Reach**: pessoas alcançadas a cada 100 rolês. A mesa média do PRD tem 4 pessoas, então 100 rolês equivalem a cerca de 400 pessoas, das quais 1 fotografa e 3 são cobradas.
- **Impact**: 3 massivo, 2 alto, 1 médio, 0,5 baixo.
- **Confidence**: 100% quando existe código ou diff pronto, 80% quando o caminho técnico é claro, 50% quando depende de comportamento que nunca medimos.
- **Effort**: semanas de uma pessoa.

As candidatas saíram do PRD, dos mockups já desenhados e do histórico do git, não de brainstorm. Cada linha abaixo tem uma fonte no repositório.

### A tabela

| # | Feature | R | I | C | E | **RICE** |
|---|---|---|---|---|---|---|
| 1 | IA sugerir o que é item compartilhado | 400 | 1 | 80% | 0,5 | **640** |
| 2 | Pix de verdade: BR Code com o valor da parte | 300 | 2 | 50% | 0,5 | **600** |
| 3 | Link público do rolê para quem foi cobrado | 300 | 2 | 80% | 1 | **480** |
| 4 | Convidado marca o próprio consumo pelo celular dele | 300 | 3 | 50% | 3 | **150** |
| 5 | Cache da leitura por hash da imagem | 20 | 1 | 100% | 0,25 | **80** |

### Uma a uma

**1. IA sugerir o que é item compartilhado (640)**

Hoje todo item nasce "SEM DONO" e o botão de avançar só libera quando 100% foi atribuído. Couvert, entrada e porção são quase sempre da mesa inteira, e alguém marca isso na mão toda vez. O prompt de extração passaria a devolver um sinal de "provavelmente compartilhado" e o app pré-marcaria.

Lidera por aritmética, não por ambição: é a única da lista que toca 100% de quem usa o app, e custa meio dia de trabalho porque o campo entra no JSON que a IA já devolve. Impacto 1 porque economiza toques, não desbloqueia nada novo.

**2. Pix de verdade: BR Code com o valor da parte (600)**

O campo de Pix copia só a chave: o valor ainda é digitado à mão no banco, que é exatamente onde o erro de centavo reaparece depois de todo o cuidado do motor de cálculo. Pior: quem não tem conta cobra com `divideai@pix.com.br`, uma chave fictícia que está no código como fallback.

O payload EMV é gerado no próprio cliente, sem backend. Confiança 50% porque não sabemos quantas contas têm chave cadastrada, e essa é a pergunta que o PostHog vai responder em duas semanas.

**3. Link público do rolê para quem foi cobrado (480)**

O PRD tem como P0: "como quem foi cobrado, quero ver o que devo e marcar como pago". Foi entregue pela metade. Hoje a cobrança é um texto aberto no WhatsApp, e a única pessoa que enxerga o rolê é a dona do cookie. O próprio código admite o buraco: um comentário em `payments.ts` registra que o pagador nunca tem o cookie do dono.

**4. Convidado marca o próprio consumo (150)**

Estrategicamente é a maior da lista, e o RICE a coloca em quarto. Vale explicar por quê, em vez de esconder: impacto 3 (é a etapa mais longa do fluxo e o único mecanismo de crescimento viral que o PRD prevê), mas esforço 3 semanas e confiança 50%, porque exige token público, endpoint sem cookie de dono, tela nova e resolver duas pessoas editando o mesmo rolê ao mesmo tempo.

RICE é bom para ordenar trabalho incremental e ruim para apostas estruturais: ele divide por esforço, então toda aposta grande desce na lista. Registramos o número e a ressalva. Se a decisão do time for priorizar crescimento em vez de eficiência, esta sobe, e a justificativa é essa, não o score.

**5. Cache da leitura por hash da imagem (80)**

Não é feature nova, é regressão. O commit `be0e349` criou o cache e um sync posterior do Replit o apagou. Hoje cada leitura repetida chama a IA de novo, gasta um crédito do usuário e US$ 0,014 nossos. Confiança 100% porque o diff existe no histórico. Score baixo porque o alcance é pequeno, e ainda assim entra: é um quarto de semana e devolve crédito cobrado indevidamente.

### O que o score não decide

Duas coisas ficaram fora da tabela de propósito, porque não são features, são decisões:

- **Login obrigatório para escanear.** O commit `c8d96b1` passou a exigir conta antes da primeira foto. O PRD, o README e o `replit.md` prometem, os três, primeiro resultado sem cadastro. Isso atinge 100% de quem chega, no primeiro toque, e precisa de decisão do time, não de priorização.
- **Chaves de desenvolvimento do Clerk em produção.** O console do app publicado avisa a cada carregamento. É dívida de deploy, não escopo de produto.

### A honestidade do exercício

Os números de Reach desta tabela são estimativa fundamentada, não medição: até hoje o produto não tinha um único evento instrumentado. É justamente o que o entregável do PostHog resolve. Na próxima rodada de priorização, Reach e Confidence saem do painel, e este mesmo cálculo passa a valer o que ele aparenta valer.

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
