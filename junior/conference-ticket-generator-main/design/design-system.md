# Design System — Conference Ticket Generator

Referência dos tokens do desafio, extraída de `design/style_guide/` (cores, tipografia, spacing e radius). Os nomes de tokens seguem o guia do Figma; as custom properties e variáveis Sass são a proposta de implementação para o parcial `scss/base/_tokens.scss`.

## Visão geral

- Tema escuro: o fundo é uma imagem roxo/azul-marinho (`assets/images/background-*.png`), com texto claro.
- Fonte única: **Inconsolata** (monoespaçada), servida localmente de `assets/fonts/`.
- Layouts desenhados em **375px** (mobile), **768px** (tablet) e **1440px** (desktop).
- Abordagem mobile-first; container com `max-width: 90rem`, centralizado; suporte mínimo de 320px.

## Cores

### Neutral

| Token | HEX | RGB | HSL | Custom property |
| --- | --- | --- | --- | --- |
| Neutral 900 | `#0D082D` | 13, 8, 45 | 248, 70%, 10% | `--color-neutral-900` |
| Neutral 700 | `#4B4869` | 75, 72, 105 | 245, 19%, 35% | `--color-neutral-700` |
| Neutral 500 | `#8784A5` | 135, 132, 165 | 245, 15%, 58% | `--color-neutral-500` |
| Neutral 300 | `#D1D0D5` | 209, 208, 213 | 252, 6%, 83% | `--color-neutral-300` |
| Neutral 0 | `#FFFFFF` | 255, 255, 255 | 0, 0%, 100% | `--color-neutral-0` |

### Orange

| Token | HEX | RGB | HSL | Custom property |
| --- | --- | --- | --- | --- |
| Orange 700 | `#E1604F` | 225, 96, 79 | 7, 71%, 60% | `--color-orange-700` |
| Orange 500 | `#F57463` | 245, 116, 99 | 7, 88%, 67% | `--color-orange-500` |

### Gradiente

| Token | CSS | Custom property |
| --- | --- | --- |
| Gradient 01 | `linear-gradient(90deg, #F37362 0%, #FFF 100%)` | `--gradient-01` |

> O gradiente começa em `#F37362`, que difere levemente de Orange 500 (`#F57463`). O valor foi mantido exatamente como está no guia.

Uso previsto (a confirmar ao implementar os componentes): Neutral 0 para texto principal; Neutral 300/500 para texto secundário e bordas; Neutral 700/900 para superfícies escuras; Orange 500/700 para botão (normal/hover) e realces; Gradient 01 para o nome no ticket.

## Tipografia

Família: `Inconsolata` (variável + estáticas Regular/Medium/Bold/ExtraBold em `assets/fonts/`), carregada com `@font-face` e caminho relativo. Sem fallback sans-serif, pois a fonte é monoespaçada; usar `monospace` como fallback genérico.

| Preset | Peso | Desktop | Mobile | Line height | Letter spacing | Uso |
| --- | --- | --- | --- | --- | --- | --- |
| Text Preset 1 | ExtraBold (800) | 60px | 30px | 110% | -1px | Título principal |
| Text Preset 2 | Bold (700) | 40px | 24px | 110% | -1px | Título do ticket |
| Text Preset 3 | Bold (700) | 30px | 22px | 110% | -1px | Destaques / nome no ticket |
| Text Preset 4 | Medium (500) | 24px | 20px | 120% | -0.5px | Subtítulo |
| Text Preset 5 | Medium (500) | 20px | — | 110% | -0.5px | Texto de apoio |
| Text Preset 5 (ExtraBold) | ExtraBold (800) | 20px | — | 110% | -0.3px | Variante em negrito |
| Text Preset 6 | Medium (500) | 18px | 14px | 120% | 0 | Corpo / labels |
| Text Preset 7 | Regular (400) | 12px | — | 120% | -0.2px | Dica do upload |

Os presets 5 e 7 não têm versão mobile no guia: o tamanho é fixo. A coluna "Uso" é uma sugestão a confirmar contra `design/layout/`; o style guide não indica onde cada preset se aplica.

### Tamanhos fluidos

Interpolação linear entre 375px (23.4375rem) e 1440px (90rem), com `rem` para respeitar a preferência de fonte do usuário:

| Token | `font-size` |
| --- | --- |
| `--text-preset-1-size` | `clamp(1.875rem, 1.2148rem + 2.8169vw, 3.75rem)` |
| `--text-preset-2-size` | `clamp(1.5rem, 1.1479rem + 1.5023vw, 2.5rem)` |
| `--text-preset-3-size` | `clamp(1.375rem, 1.1989rem + 0.7512vw, 1.875rem)` |
| `--text-preset-4-size` | `clamp(1.25rem, 1.162rem + 0.3756vw, 1.5rem)` |
| `--text-preset-5-size` | `1.25rem` |
| `--text-preset-6-size` | `clamp(0.875rem, 0.787rem + 0.3756vw, 1.125rem)` |
| `--text-preset-7-size` | `0.75rem` |

Os demais atributos têm o mesmo valor em desktop e mobile, então são tokens únicos:

| Preset | `--text-preset-N-weight` | `--text-preset-N-line-height` | `--text-preset-N-letter-spacing` |
| --- | --- | --- | --- |
| 1 | 800 | 1.1 | -1px |
| 2 | 700 | 1.1 | -1px |
| 3 | 700 | 1.1 | -1px |
| 4 | 500 | 1.2 | -0.5px |
| 5 | 500 | 1.1 | -0.5px |
| 5 (ExtraBold), sufixo `-bold` | 800 | 1.1 | -0.3px |
| 6 | 500 | 1.2 | 0 |
| 7 | 400 | 1.2 | -0.2px |

A variante ExtraBold do preset 5 usa o sufixo `-bold` (`--text-preset-5-bold-weight`, `--text-preset-5-bold-letter-spacing`) e reaproveita tamanho e line-height do preset 5.

## Spacing

| Token | Pixels | rem | Custom property |
| --- | --- | --- | --- |
| spacing-0 | 0 | 0 | `--spacing-0` |
| spacing-025 | 2px | 0.125rem | `--spacing-025` |
| spacing-050 | 4px | 0.25rem | `--spacing-050` |
| spacing-075 | 6px | 0.375rem | `--spacing-075` |
| spacing-100 | 8px | 0.5rem | `--spacing-100` |
| spacing-150 | 12px | 0.75rem | `--spacing-150` |
| spacing-200 | 16px | 1rem | `--spacing-200` |
| spacing-250 | 20px | 1.25rem | `--spacing-250` |
| spacing-300 | 24px | 1.5rem | `--spacing-300` |
| spacing-400 | 32px | 2rem | `--spacing-400` |
| spacing-500 | 40px | 2.5rem | `--spacing-500` |
| spacing-600 | 48px | 3rem | `--spacing-600` |
| spacing-800 | 64px | 4rem | `--spacing-800` |
| spacing-1000 | 80px | 5rem | `--spacing-1000` |

O número do token é a escala do Figma (200 = 16px, 400 = 32px), não o valor em pixels. Não existem tokens 700 nem 900.

## Radius

| Token | Pixels | Custom property |
| --- | --- | --- |
| radius-0 | 0 | `--radius-0` |
| radius-4 | 4px | `--radius-4` |
| radius-6 | 6px | `--radius-6` |
| radius-8 | 8px | `--radius-8` |
| radius-10 | 10px | `--radius-10` |
| radius-12 | 12px | `--radius-12` |
| radius-16 | 16px | `--radius-16` |
| radius-20 | 20px | `--radius-20` |
| radius-24 | 24px | `--radius-24` |
| radius-full | 999px | `--radius-full` |

## Breakpoints

Variáveis Sass (custom properties não funcionam em condição de `@media`), consumidas por um mixin com `min-width` em `em`:

| Variável | Valor | Equivale a | Observação |
| --- | --- | --- | --- |
| `$bp-tablet` | `48em` | 768px | Layout tablet |
| `$bp-desktop` | `90em` | 1440px | Só se o layout mudar de fato |

Base mobile-first a partir de 320px (20em) sem quebrar.

## Organização sugerida no código

```text
scss/
├── main.scss              // só @use dos parciais
├── abstracts/
│   ├── _breakpoints.scss  // $bp-tablet, $bp-desktop e mixin
├── base/
│   ├── _tokens.scss       // :root com as custom properties acima
│   ├── _fonts.scss        // @font-face (caminhos relativos)
│   └── _reset.scss
```

## Fora do escopo do style guide

O guia não define sombras, bordas, tamanhos de ícone nem estados de interação (hover, focus, error). Esses valores devem ser lidos de `design/interaction/` e `design/components/` ao implementar cada componente.
