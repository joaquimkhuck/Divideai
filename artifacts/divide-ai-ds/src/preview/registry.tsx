import { lazy, type ComponentType } from 'react';
import {
  ColorsPage,
  FontsPage,
  LayoutPage,
  OverviewPage,
} from './foundations';

function lazyPage(load: () => Promise<ComponentType>) {
  return lazy(async () => ({ default: await load() }));
}

const ButtonDemo = lazyPage(() =>
  import('./demos/button').then(({ ButtonDemo }) => ButtonDemo),
);
const PersonChipDemo = lazyPage(() =>
  import('./demos/person-chip').then(({ PersonChipDemo }) => PersonChipDemo),
);
const ItemCardDemo = lazyPage(() =>
  import('./demos/item-card').then(({ ItemCardDemo }) => ItemCardDemo),
);
const InputDemo = lazyPage(() =>
  import('./demos/input').then(({ InputDemo }) => InputDemo),
);
const BadgeDemo = lazyPage(() =>
  import('./demos/badge').then(({ BadgeDemo }) => BadgeDemo),
);
const AvatarDemo = lazyPage(() =>
  import('./demos/avatar').then(({ AvatarDemo }) => AvatarDemo),
);
const CardDemo = lazyPage(() =>
  import('./demos/card').then(({ CardDemo }) => CardDemo),
);
const SettlementRowDemo = lazyPage(() =>
  import('./demos/settlement-row').then(
    ({ SettlementRowDemo }) => SettlementRowDemo,
  ),
);
const ChargeSheetDemo = lazyPage(() =>
  import('./demos/charge-sheet').then(({ ChargeSheetDemo }) => ChargeSheetDemo),
);
const ScanProgressDemo = lazyPage(() =>
  import('./demos/scan-progress').then(
    ({ ScanProgressDemo }) => ScanProgressDemo,
  ),
);
const EmptyStateDemo = lazyPage(() =>
  import('./demos/empty-state').then(({ EmptyStateDemo }) => EmptyStateDemo),
);

export type PreviewEntry = {
  // Globally unique across every group — it is the deep-link slug (`#page=<id>`)
  // and the active-page key. Group-qualify names that repeat across groups
  // (e.g. `brand-icons` vs `components-icons`).
  id: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export type NavGroup = {
  name: string;
  entries: PreviewEntry[];
};

export const DESIGN_SYSTEM = {
  title: 'Divide Aí Design System',
  description:
    'Imediato, redondo, calmo — o sistema visual do app que divide a conta do restaurante a partir de uma foto.',
} as const;

export const OVERVIEW_ENTRY: PreviewEntry = {
  id: 'overview',
  name: 'Visão geral',
  description: 'As fundações e os componentes-piloto do Divide Aí.',
  Page: OverviewPage,
};

export const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Cores',
    entries: [
      {
        id: 'color-roles',
        name: 'Papéis de cor',
        description:
          'Névoa, Papel, Grafite e o único acento Azul-profundo — cor por situação, não por estética.',
        Page: ColorsPage,
      },
    ],
  },
  {
    name: 'Tipografia',
    entries: [
      {
        id: 'type-scale',
        name: 'Escala tipográfica',
        description:
          'Nunito única (400/700/800); dinheiro sempre ExtraBold com centavos e algarismos tabulares.',
        Page: FontsPage,
      },
    ],
  },
  {
    name: 'Layout',
    entries: [
      {
        id: 'spacing-radius',
        name: 'Espaçamento e raios',
        description:
          'Grade de 8, margens de 24pt, uma coluna, tudo redondo (mínimo 16pt).',
        Page: LayoutPage,
      },
    ],
  },
  {
    name: 'Ações',
    entries: [
      {
        id: 'button',
        name: 'Botões',
        description:
          'Botão-herói circular de 96pt, cápsula primária de 56pt e secundária com contorno.',
        Page: ButtonDemo,
      },
    ],
  },
  {
    name: 'Formulários',
    entries: [
      {
        id: 'review-field',
        name: 'Campo de revisão',
        description:
          'Campo raio 16 em Papel; foco Azul-profundo 2pt, erro de leitura em Telha.',
        Page: InputDemo,
      },
    ],
  },
  {
    name: 'Exibição',
    entries: [
      {
        id: 'person-chip',
        name: 'Chip de pessoa',
        description:
          'Cápsula de 36pt com avatar-inicial — o gesto central de atribuir itens.',
        Page: PersonChipDemo,
      },
      {
        id: 'item-card',
        name: 'Cartão de item',
        description:
          'Papel raio 24: descrição + valor ExtraBold, chips atribuídos, etiqueta "SEM DONO".',
        Page: ItemCardDemo,
      },
      {
        id: 'status-badge',
        name: 'Etiquetas de status',
        description:
          'Cápsulas PAGO / PENDENTE / SEM DONO — Verde-salva confirma, Âmbar pede decisão.',
        Page: BadgeDemo,
      },
      {
        id: 'settlement-row',
        name: 'Linha de fechamento',
        description:
          'Nome + valor como par inseparável; selo Verde-salva ao confirmar pagamento.',
        Page: SettlementRowDemo,
      },
      {
        id: 'card',
        name: 'Cartão',
        description: 'Papel, raio 24, sombra mínima — papel sobre a mesa.',
        Page: CardDemo,
      },
      {
        id: 'avatar',
        name: 'Avatar',
        description: 'Círculo com a inicial do nome sobre fundo neutro.',
        Page: AvatarDemo,
      },
    ],
  },
  {
    name: 'Folhas',
    entries: [
      {
        id: 'charge-sheet',
        name: 'Folha de cobrança',
        description:
          'Bottom sheet raio 28 com valor-herói, Pix copiável e botão do WhatsApp.',
        Page: ChargeSheetDemo,
      },
    ],
  },
  {
    name: 'Retorno',
    entries: [
      {
        id: 'scan-progress',
        name: 'Progresso da leitura',
        description:
          'Anel Azul-profundo girando sobre a miniatura da foto — nunca barra ou esqueleto.',
        Page: ScanProgressDemo,
      },
      {
        id: 'empty-state',
        name: 'Estado vazio',
        description: 'Título + frase + botão primário, sem ilustração.',
        Page: EmptyStateDemo,
      },
    ],
  },
];

export const ALL_ENTRIES: PreviewEntry[] = [
  OVERVIEW_ENTRY,
  ...NAV_GROUPS.flatMap((group) => group.entries),
];

// A duplicate id would make one page unreachable (its deep link and highlight
// resolve to the first match), so fail loudly instead of shipping a dead page.
const duplicateIds = ALL_ENTRIES.map((entry) => entry.id).filter(
  (id, index, ids) => ids.indexOf(id) !== index,
);
if (duplicateIds.length > 0) {
  throw new Error(
    `Duplicate preview page id(s): ${[...new Set(duplicateIds)].join(
      ', ',
    )}. Every page id must be unique across all nav groups.`,
  );
}
