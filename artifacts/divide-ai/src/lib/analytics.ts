import posthog from 'posthog-js';

// Token de projeto do PostHog: é público por definição (vai no bundle do
// navegador) e só permite escrever eventos. Nada de chave pessoal aqui.
// VITE_POSTHOG_KEY sobrescreve quando quisermos apontar para outro projeto.
const KEY =
  import.meta.env.VITE_POSTHOG_KEY ??
  'phc_B87ZtGNSHKCtUhpBGpVBdRDxiGACvgJAibKGgHLkqbXH';

// Conta na nuvem dos EUA.
const HOST = 'https://us.i.posthog.com';

export function initAnalytics() {
  posthog.init(KEY, {
    api_host: HOST,
    // defaults liga o pacote atual de comportamentos recomendados, incluindo
    // pageview por History API, que é o que um SPA com wouter precisa.
    defaults: '2025-05-24',
    person_profiles: 'identified_only',
  });
}

export { posthog };
