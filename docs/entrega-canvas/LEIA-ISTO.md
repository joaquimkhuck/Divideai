# Entrega de quinta, mastigada

Nesta pasta tem tudo que você precisa. Leia os 4 passos, leva 10 minutos.

```
Divide Ai - entregavel SEO e GEO.pdf   <- é isto que você sobe no Canvas
print-posthog.jpg                       <- exemplo do print (você vai tirar o seu)
LEIA-ISTO.md                            <- este arquivo
```

## O que o professor pediu, e onde está

| O que ele pediu | Onde está | Você precisa fazer algo? |
|---|---|---|
| 1. Title, meta description e H1 num documento, e aplicados no site | Seção 1 do PDF. No ar em divideai.pangeia.cloud | Não |
| 2. Os links /robots.txt, /sitemap.xml e /llms.txt | Seção 2 do PDF. Os três respondendo | Não |
| 3. As próximas 5 features com score | Seção 3 do PDF, tabela RICE | Não |
| 4. Conta do PostHog + print do painel com a **sua** visita | Seção 4 do PDF | **Sim, só isto** |

## Passo 1: aceitar o convite do PostHog

Vai chegar um e-mail de convite (assunto do PostHog, organização `healby`). Clique em aceitar e crie a senha, ou entre com GitHub. O convite expira em 3 dias, então faça hoje.

Não chegou? Avise no grupo, o convite precisa ser reenviado.

## Passo 2: gerar a sua visita

Abra **https://divideai.pangeia.cloud** no seu navegador, celular ou computador, tanto faz.

Navegue por duas ou três telas: a home, depois "Rolês anteriores", depois volte pra home. Cada troca de tela registra um evento com o **seu** navegador, e é isso que o print precisa mostrar.

Se você usa bloqueador de anúncio, **não precisa desligar**. O app manda os eventos pelo próprio domínio justamente por causa disso, e esse foi um dos achados do trabalho (está na seção 4 do PDF).

## Passo 3: tirar o print

1. Abra **https://us.posthog.com**
2. No menu da esquerda, clique em **Activity**
3. Espere uns 30 segundos e clique em **Reload**
4. Você vai ver linhas assim:

```
Pageview    <seu id>    https://divideai.pangeia.cloud/        web    a few seconds ago
Pageleave   <seu id>    https://divideai.pangeia.cloud/roles   web    a few seconds ago
```

5. Print dessa tela

**Deixe o print limpo (opcional, mas melhora):** clique em `+ Property filters`, digite `Library`, escolha `Library`, e no valor escolha `web`. Isso esconde qualquer requisição de teste e deixa só visita de navegador de verdade. O `print-posthog.jpg` desta pasta é um exemplo de como fica.

## Passo 4: submeter no Canvas

Suba dois arquivos:

1. `Divide Ai - entregavel SEO e GEO.pdf`
2. O seu print do PostHog

Pronto. Entrega individual, mesmo documento para os três, print próprio de cada um.

## Se o professor perguntar alguma coisa

Os quatro itens são de grupo por definição: existe um site só, um domínio só e um projeto de analytics só. O que vale cada um saber explicar são os três achados de verdade do trabalho, que estão detalhados no PDF:

1. **`sitemap.xml` e `llms.txt` respondiam HTTP 200 antes de existirem.** O servidor devolve o `index.html` para qualquer caminho desconhecido, que é como uma SPA funciona. Quem conferisse por status code concluiria que estava tudo certo.

2. **O H1 não existia para quem não roda JavaScript.** O app é React: o HTML servido era `<div id="root"></div>`. O Googlebot renderiza JavaScript e veria; GPTBot e PerplexityBot, que alimentam busca generativa, não renderizam. Por isso o H1 e um bloco "Como funciona" foram colocados também no HTML estático.

3. **O PostHog inicializava e não registrava nada.** Bloqueador de rastreador no navegador cortava só a chamada de captura: `Failed to fetch` no navegador, `200 Ok` pelo terminal, e nenhum erro no console. Resolvido com proxy reverso no nosso próprio domínio.

E um quarto, se quiser mostrar que a tabela foi pensada e não chutada: **RICE penaliza aposta estrutural.** A feature mais importante do produto (cada pessoa marcar o próprio consumo pelo celular dela) ficou em quarto lugar, porque o RICE divide por esforço. Isso está escrito no documento de propósito, com a ressalva.
