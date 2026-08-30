# Styllus Fitness Center — sistema visual

## Direção

A superfície Persuade usa a identidade existente navy, grafite, metálica e azul elétrico para transformar fatos concretos em decisão rápida. A composição é editorial: títulos condensados e grandes, linhas finas, imagens reais em recortes retos e bastante espaço negativo.

## Tokens

- Fundo: `--black` (#030508), grafite `--graphite` (#080b10) e superfície `--surface` (#0d1118).
- Ação: `--blue` (#087cff) para acentos sobre fundos escuros; CTAs usam
  `--blue-action` (#0066d6) e `--blue-action-deep` (#004cad) para manter
  contraste AA com texto claro; destaque `--blue-light` (#39a2ff).
- Texto: `--white`, `--silver` e `--muted`.
- Tipos: Anton para títulos, Barlow para leitura e JetBrains Mono para labels e medidas.
- Container: `min(1180px, calc(100% - 40px))`, reduzido para 16px de margem em mobile.

## Componentes

Header fixo com navegação e menu móvel acessível; botões primário/outline; faixa de provas; blocos de plano; galeria manual com contagem, controles de 44px e lightbox; mapa; CTA flutuante e rodapé.

## Movimento e responsividade

GSAP anima a entrada do hero e reveals de seções. O conteúdo começa visível e
`prefers-reduced-motion` remove deslocamentos decorativos sem apagar feedback de
estado. Layout mobile-first cobre 360px+, tablet e telas largas sem overflow,
com safe-areas no header, hero, rota de links e CTA flutuante.

## Rotas

`index.html` contém a história, oferta, estrutura, diferenciais, horários, localização e conversões. `links/index.html` compartilha somente base tipográfica, tokens e componentes; o mapa só cria seu `src` após abertura.
