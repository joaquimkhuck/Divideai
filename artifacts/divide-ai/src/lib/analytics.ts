import posthog from 'posthog-js';

// Token de projeto do PostHog: é público por definição (vai no bundle do
// navegador) e só permite escrever eventos. Nada de chave pessoal aqui.
// VITE_POSTHOG_KEY sobrescreve quando quisermos apontar para outro projeto.
const KEY =
  import.meta.env.VITE_POSTHOG_KEY ??
  'phc_B87ZtGNSHKCtUhpBGpVBdRDxiGACvgJAibKGgHLkqbXH';

// Os eventos saem pelo nosso próprio domínio (/ingest), que o Caddy repassa
// para a nuvem dos EUA do PostHog. Medido no navegador: chamando
// us.i.posthog.com direto, o bloqueador de rastreador derruba a captura e o
// evento nunca chega. ui_host é só para os links do painel.
const HOST = '/ingest';
const UI_HOST = 'https://us.posthog.com';

export function initAnalytics() {
  posthog.init(KEY, {
    api_host: HOST,
    ui_host: UI_HOST,
    // defaults liga o pacote atual de comportamentos recomendados, incluindo
    // pageview por History API, que é o que um SPA com wouter precisa.
    defaults: '2025-05-24',
    person_profiles: 'identified_only',
  });
}

export { posthog };
