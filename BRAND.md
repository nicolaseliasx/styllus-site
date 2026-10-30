# Brand Book — Styllus Fitness Center

Baseado no template "applying-brand-guidelines" do Claude Cookbook, aplicado à
identidade real extraída dos assets oficiais.

## Marca

Styllus Fitness Center — academia de bairro séria em Palhoça/SC (Pte. do
Imaruim), reinaugurada com estrutura renovada de equipamentos Santana Fitness.
Posicionamento: academia para quem quer **treinar de verdade** — sem enrolação,
com equipe presente e planos acessíveis.

## Logo (intocável)

| Asset | Uso |
| --- | --- |
| `assets/styllus-mark.webp` (1280×1280) | Emblema oficial de referência |
| `assets/styllus-lockup.webp` (960×960) | Lockup completo — cabeçalho da home e rota de links |
| `assets/styllus-mark-header.webp` (180×180) | Favicon e header/footer |

- Nunca redesenhar, recolorir, adicionar contornos ou distorcer.
- Sempre sobre fundo navy (`--navy`), sem glow, sombra ou contorno.
- Espaço limpo mínimo ao redor igual à altura da letra "S" do emblema.

## Paleta

Quatro papéis, sem variações paralelas de azul:

| Token | Hex | Papel |
| --- | --- | --- |
| `--navy` | `#08111b` | Cabeçalho, abertura, convite final, rodapé e `/links` |
| `--paper` | `#ffffff` | Superfície contínua do conteúdo (`--soft` `#f2f4f6` em cards) |
| `--ink` | `#15202b` | Texto sobre `--paper` (`--ink-muted` `#56616a` no secundário) |
| `--blue-action` | `#0866cc` | Ações principais e links (hover `#0757ad`) |

Apoio: `--white` `#f5f7fa` e `--silver` `#bdc5ce` para texto sobre navy;
`--surface` `#111c28` para controles sobre fotos; `--blue-light` `#3c96db` só em
foco, marcadores e na palavra de destaque do H1. Proibido: azul pastel em títulos, faixas azul-claras,
glows e gradientes decorativos.

Regra: navy no topo e no fechamento, papel no meio, azul só onde há ação. A
marca completa aparece uma vez no cabeçalho. `/links` usa os mesmos botões da home.

## Tipografia

- **Anton** (400) — título principal da abertura e título da rota de links,
  uppercase, line-height próximo de 1.02. É a voz de impacto da marca.
- **Barlow** (300/400/600/700) — leitura, títulos secundários e botões. Títulos
  de seção em 700, escrita normal e line-height próximo de 1.08. Botões da home
  e de `/links` usam escrita normal, em pílula.
- Sem fonte mono: contadores e rodapé usam Barlow.
- Contraste de escala concentrado na abertura; os títulos seguintes guiam uma
  leitura mais leve, sem repetir letreiros de impacto.

## Voz e tom

Motivacional mas concreto. Frases curtas. Imperativo. Zero clichês de academia
de rede ("sem desculpas", "vira o jogo") e zero hype vazio.

- Bom: "Estrutura renovada. Energia de sempre." / "Treino de verdade começa
  com estrutura de verdade."
- Ruim: "A academia mais incrível da região!!!" / "Promoção imperdível".

Valores fixos do rodapé: **Força · Saúde · Disciplina · Resultados**.

## Checklist de qualidade (antes de qualquer merge)

- [ ] Logo intacto (hashes verdes em `npm test`)
- [ ] Sem overflow horizontal em 360px e 1920px
- [ ] Alvos de toque ≥ 44px; safe-areas iOS ok
- [ ] `prefers-reduced-motion`: conteúdo 100% acessível sem animação
- [ ] LCP do hero com `fetchpriority="high"` + `srcset` nas fotos
- [ ] Copy em pt-BR, tom do brand book, dados de contato corretos
- [ ] Hero navy com foto real, conteúdo em `--paper` e azul apenas nas ações
