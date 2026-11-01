# Design system NEONCORE

Fonte de consulta para implementar os estilos. Conferido contra `design/guide_style/*.png` (Color, Typography, Spacing, Effects, Radius). Os tokens viram custom properties em `scss/_tokens.scss`.

## Princípios
- Tema escuro, **todos os cantos retos** (`corner-radius-0` = 0px): painel, inputs, checkbox, botões e segmentos do medidor.
- Mobile-first; mínimo 320px (20em); breakpoints em `em`.

## Cores

### Neutral
| Token | Hex | RGB | Uso |
|---|---|---|---|
| `--neutral-950` | `#060A0E` | 6 10 14 | fundo da página |
| `--neutral-900` | `#0B1219` | 11 18 25 | superfície do painel |
| `--neutral-800` | `#17212B` | 23 33 43 | |
| `--neutral-700` | `#303D4B` | 48 61 75 | bordas |
| `--neutral-600` | `#586B7E` | 88 107 126 | |
| `--neutral-500` | `#6E7F91` | 110 127 145 | |
| `--neutral-400` | `#7D8C9B` | 125 140 155 | |
| `--neutral-300` | `#9FADBC` | 159 173 188 | |
| `--neutral-100` | `#E1EBF5` | 225 235 245 | |
| `--neutral-50` | `#F3F8FC` | 243 248 252 | texto principal, botão |

(Os usos acima são indicativos; confirmar nos layouts de `design/layout/` ao estilizar cada componente.)

### Cores de destaque
| Token | Hex | Uso |
|---|---|---|
| `--lime-500` | `#BFF538` | cantos do painel, foco, ícones, destaque |
| `--lime-700` | `#80A621` | |
| `--red-400` | `#FF837A` | erro |
| `--amber-400` | `#FFC44D` | força Fair |
| `--navy-950` | `#020508` | base das sombras |

### Transparentes
| Token | Valor |
|---|---|
| `--lime-alpha-60` | `#BFF53899` |
| `--lime-alpha-40` | `#BFF53866` |
| `--navy-alpha-80` | `#020508CC` |
| `--navy-alpha-60` | `#02050899` |

## Tipografia
Famílias: **Orbitron** ExtraBold (800) e **JetBrains Mono** (400 e 700). Fontes locais em `public/assets/fonts` (`@font-face`): `orbitron/static/orbitron-800.ttf`, `jetbrains-mono/static/jetbrains-mono-400.ttf` e `-700.ttf`. Tamanhos fluidos com `clamp()`.

| Preset | Família / peso | Tamanho | Line-height | Tracking | Caixa |
|---|---|---|---|---|---|
| 1 desktop | Orbitron 800 | 72px | 111,11% | 2,88px | uppercase |
| 1 tablet | Orbitron 800 | 40px | 120% | 1,6px | uppercase |
| 1 mobile | Orbitron 800 | 36px | 111,11% | 1,44px | uppercase |
| 2 | Orbitron 800 | 24px | 133,33% | 0,96px | normal |
| 3 | Orbitron 800 | 16px | 150% | 2,56px | normal |
| 4 | JetBrains Mono 400 | 16px | 150% | 0 | normal (corpo e inputs) |
| 4 mascarado | JetBrains Mono 400 | 16px | 150% | 2,56px | normal (senha oculta) |
| 5 | JetBrains Mono 400 | 14px | 171,43% | 0 | normal |
| 5 bold | JetBrains Mono 700 | 14px | 171,43% | 2,24px | uppercase |
| 6 | JetBrains Mono 400 | 12px | 133,33% | 1,92px | uppercase |
| 6 misto | JetBrains Mono 400 | 12px | 133,33% | 1,92px | normal |
| 7 | JetBrains Mono 400 | 12px | 133,33% | 0 | normal |

Preset 1 muda em tablet e mobile: o tamanho desktop (72px) só vale a partir do breakpoint desktop.

## Espaçamento
| Token | Px |
|---|---|
| `--spacing-0` | 0 |
| `--spacing-025` | 2 |
| `--spacing-050` | 4 |
| `--spacing-100` | 8 |
| `--spacing-150` | 12 |
| `--spacing-200` | 16 |
| `--spacing-250` | 20 |
| `--spacing-300` | 24 |
| `--spacing-400` | 32 |
| `--spacing-500` | 40 |
| `--spacing-600` | 48 |
| `--spacing-800` | 64 |
| `--spacing-1000` | 80 |

`spacing-025` (2px) é a folga entre um controle e seu anel de foco. O anel do botão de revelar senha fica **4px por dentro**.

## Radius
`--radius-0: 0` (`corner-radius-0`). Não existe outro valor.

## Efeitos
| Token | Valor | Uso |
|---|---|---|
| `--shadow-panel` | `0 24px 64px -16px` Navy Alpha 80 | painel do formulário |
| `--shadow-well` | `inset 0 2px 4px` Navy Alpha 60 | inputs (checkbox sem sombra) |
| `--shadow-button-hover` | `4px 4px 0` Lime Alpha 40 | botão de enviar e "Continue to log in" no hover; nunca durante o loading |
| `--glow-neon` | `0 0 16px` Lime Alpha 60 | hex-check do sucesso; em `filter: drop-shadow` usar **8px** (metade do blur) |

## Breakpoints (decisão de implementação)
Os PNGs de layout estão em 1440 / 768 / 375px. Mobile-first com `min-width`:

| Variável Sass | Valor | Layout |
|---|---|---|
| (base) | 0 | mobile, mínimo 20em |
| `$bp-tablet` | `48em` (768px) | tablet |
| `$bp-desktop` | `64em` (1024px) | desktop |

Em tablet e mobile o readout vira uma faixa de uma linha (Operator ID + callsign) e o cabeçalho do painel mostra "All required" (em vez de "All fields required").

## Imagens e ícones (`public/assets/images`)
`pattern-backdrop.svg` (fundo), `logo.svg`, `icon-eye.svg`, `icon-eye-off.svg`, `icon-alert.svg`, `icon-tick-16.svg`, `icon-tick-20.svg`, `icon-hex-check.svg`, `favicon-32x32.png`. SVGs decorativos levam `aria-hidden`.

## Referências visuais
- Componentes: `design/components/` (fields, controls, readout, Backdrop).
- Estados: `design/layout/layout_input_output` (Empty, Filled, Error, Success) e `design/layout/layout_interaction` (Focus, Hover, Strength Weak/Fair/Good, Password Visible, Terms Error, Submitting).
