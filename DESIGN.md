# Styllus Fitness Center — sistema visual

## Direção

A home apresenta a academia com uma abertura fotográfica e conduz à conversa no
WhatsApp. A paleta tem quatro papéis (ver BRAND.md): navy no cabeçalho, hero,
convite final e rodapé; papel neutro contínuo no conteúdo; grafite no texto; um
único azul nas ações. Revisada em 30/10/2026 após a versão anterior misturar
preto, navy, azul pastel e brilhos.

Os prints da Smart Fit fornecidos pelo usuário orientam a integração entre
fotografia, título e ação, além do ritmo das seções claras. O
[Designeer](https://designeer.xyz/) permanece como repertório de composição.
Todos os assets publicados são da própria Styllus.

## Cores e tipografia

- Tokens em `src/styles/shared.css`: `--navy` #08111b, `--paper` #ffffff,
  `--soft` #f2f4f6, raios `--radius` 20px e `--radius-lg` 28px,
  `--ink` #15202b / `--ink-muted` #56616a, `--blue-action` #0866cc (hover #0757ad,
  texto `--white`). Botões em pílula compartilham `.button` (Barlow 700, sem
  caixa-alta) na home e em `/links`.
- Anton identifica o título principal. Barlow em 700 e escrita normal compõe os
  títulos de seção; Barlow em 400/600 serve à leitura. Não há fonte mono.
- Container: `min(1180px, calc(100% - 40px))`, com margens móveis de 16px.

## Abertura

Referência: home mobile da Smart Fit. A foto `overview-03` cobre todo o hero
(`100svh`, entre 600 e 1000px) em todas as larguras, inclusive atrás do
cabeçalho, com degradês navy no topo, na base e à esquerda para legibilidade.
O texto fica no canto inferior esquerdo: eyebrow “Desde 2005 na Ponte do
Imaruim”, H1 Anton “Sua academia em Palhoça.” com “Palhoça.” em `--blue-light`,
apoio e um único CTA “Agendar aula experimental”.

O cabeçalho é transparente sobre a foto e fica navy sólido ao rolar ou com o menu
aberto. O logo completo aparece só ali. O menu móvel é um círculo branco de 48px.

## Conteúdo e componentes

A sequência é abertura, estrutura (galeria + legenda + diferenciais),
horários/localização e convite final, que reúne aula experimental e consulta
de planos. O convite final é um card fotográfico (`overview-05`, raio 28px) com
texto branco sobre degradê navy, no estilo dos cards da referência.

A galeria é um card fotográfico 16:9 (4:5 no celular) com raio de 28px (20px
no celular). Legenda e contador ficam sobre a foto, à esquerda; as setas são
círculos brancos à direita; a ampliação é discreta no canto superior direito. Há cinco fotos,
sem autoplay, navegação manual, anúncio acessível e lightbox com teclado e
retorno de foco. As URLs ampliadas são imports do Vite e só são carregadas ao
abrir o lightbox.

Diferenciais e horários são cards `--soft` de raio 20px, sem rótulos técnicos.
O mapa usa o mesmo raio dos cards fotográficos.
A consulta de planos é um link secundário no convite final e no menu, sem
preços ou condições comerciais publicadas. Horários, endereço e mapa permanecem completos.

As setas e controles usam SVGs decorativos de 20px, traço de 1,5px e pontas
arredondadas, ocultos de leitores de tela. Os nomes acessíveis ficam nos botões.
O WhatsApp flutuante (texto branco sobre `--blue-action`, contraste ≥4.5 medido no navegador) fica oculto enquanto o CTA inicial, a galeria ou o mapa
estão visíveis, protegendo os controles dessas áreas.

## Rotas, movimento e verificação

`/links` usa fundo navy liso, os mesmos botões da home, os atalhos de aula experimental/planos, mapa
recolhido e link para o site. Estilos e configuração de WhatsApp são
compartilhados; URLs de contato funcionam mesmo sem JavaScript.

GSAP atua na entrada do texto do hero e nos reveals de seção. O conteúdo inicia
visível e movimento reduzido mantém toda a leitura e interação disponíveis.

`npm test` cobre conteúdo, contatos, contraste e assets. `npm run test:responsive`
cobre primeira tela a partir de 360×640, altura móvel reduzida de 390×650, toque,
menu, galeria, movimento e contato com/sem JavaScript. `npm run test:production`
valida as duas rotas e as cinco fotos ampliadas na raiz e em `/styllus/`.

A entrega para revisão ocorre somente em `styllus-homologacao.ncls.cc`, usando
uma cópia do build separada do diretório de trabalho. Produção aguarda aprovação.
