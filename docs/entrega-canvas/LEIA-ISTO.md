# Entrega de quinta

Dois arquivos, sobe os dois no Canvas e acabou.

```
Divide Ai - entregavel SEO e GEO.pdf   <- o documento
print-posthog.jpg                       <- o print do painel do PostHog
```

Não tem passo individual. Não precisa instalar, criar conta nem gerar nada. O print do painel já é o do nosso app, com os eventos chegando de divideai.pangeia.cloud.

## O que o professor pediu, e onde está

| O que ele pediu | Onde está |
|---|---|
| 1. Title, meta description e H1 num documento, e aplicados no site | Seção 1 do PDF. No ar em divideai.pangeia.cloud |
| 2. Os links /robots.txt, /sitemap.xml e /llms.txt | Seção 2 do PDF. Os três respondendo |
| 3. As próximas 5 features com score | Seção 3 do PDF, tabela RICE |
| 4. Conta do PostHog, código no app publicado, print do painel | Seção 4 do PDF + `print-posthog.jpg` |

Se quiser conferir com os próprios olhos antes de entregar, é um comando:

```
curl -s https://divideai.pangeia.cloud/ | grep -i "<title>\|description\|<h1"
```

E os três arquivos abrem direto no navegador:
divideai.pangeia.cloud/robots.txt · /sitemap.xml · /llms.txt

## Se o professor puxar assunto

Os três achados de verdade do trabalho, todos detalhados no PDF:

1. **`sitemap.xml` e `llms.txt` respondiam HTTP 200 antes de existirem.** O servidor devolve o `index.html` para qualquer caminho desconhecido, que é como uma SPA funciona. Quem conferisse por status code concluiria que estava tudo certo.

2. **O H1 não existia para quem não roda JavaScript.** O app é React: o HTML servido era `<div id="root"></div>`. O Googlebot renderiza JavaScript e veria; GPTBot e PerplexityBot, que alimentam busca generativa, não renderizam. Por isso o H1 e um bloco "Como funciona" foram colocados também no HTML estático.

3. **O PostHog inicializava e não registrava nada.** Bloqueador de rastreador no navegador cortava só a chamada de captura: `Failed to fetch` no navegador, `200 Ok` pelo terminal, e zero erro no console. Resolvido com proxy reverso no nosso próprio domínio.

E um quarto, se quiser mostrar que a tabela de features foi pensada e não chutada: **RICE penaliza aposta estrutural.** A feature mais importante do produto (cada pessoa marcar o próprio consumo pelo celular dela) ficou em quarto lugar, porque o RICE divide por esforço. Isso está escrito no documento de propósito, com a ressalva.
