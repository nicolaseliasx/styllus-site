# Styllus Fitness Center — sistema visual

## Direção

A home apresenta a academia com uma abertura fotográfica e conduz à conversa no
WhatsApp. A página é inteira escura (ver BRAND.md): navy contínuo do hero ao rodapé, cards
`--soft` com borda sutil, texto claro e um único azul nas ações. Revisada em 30/10/2026 após a versão anterior misturar
preto, navy, azul pastel e brilhos.

Os prints da Smart Fit fornecidos pelo usuário orientam a integração entre
fotografia, título e ação, além do ritmo das seções claras. O
[Designeer](https://designeer.xyz/) permanece como repertório de composição.
Todos os assets publicados são da própria Styllus.

## Cores e tipografia

- Tokens em `src/styles/shared.css`: `--navy` #08111b, `--paper` #08111b,
  `--soft` #121e2b, raios `--radius` 20px e `--radius-lg` 28px,
  `--ink` #f5f7fa / `--ink-muted` #a9b4c0, `--blue-action` #0866cc (hover #0757ad,
  texto `--white`). Botões em pílula compartilham `.button` (Barlow 700, sem
  caixa-alta) na home e em `/links`.
- Anton identifica o título principal. Barlow em 700 e escrita normal compõe os
  títulos de seção; Barlow em 400/600 serve à leitura. Não há fonte mono.
- Container: `min(1180px, calc(100% - 40px))`, com margens móveis de 16px.

## Abertura

Referência: home mobile da Smart Fit. A foto `overview-03` cobre todo o hero
(`100svh`, entre 600 e 1000px) em todas as larguras, inclusive atrás do
cabeçalho, com degradês navy no topo, na base e à esquerda para legibilidade.
O texto fica no canto inferior esquerdo: eyebrow “Academia desde 2005”, H1 Anton “Sua academia em Palhoça.” com “Palhoça.” em `--blue-light`,
apoio e um único CTA “Agendar aula experimental”.

O cabeçalho (80px; 68px no celular) é transparente sobre a foto e, ao rolar, fica
navy translúcido (0.78) com desfoque; com o menu aberto, navy sólido. O logo
completo aparece só ali, compacto: 60px (50px no celular). O menu móvel é um
círculo branco de 48px.

## Conteúdo e componentes

A sequência é abertura, localização e horários, estrutura (galeria + legenda +
diferenciais) e convite final. A localização é prioridade: o hero traz o endereço
com link de rota (`data-hero-location`, Google Maps directions) na primeira tela,
e a seção “Onde e quando treinar.” (`#localizacao`, com `#horarios`) reúne
endereço, botão “Como chegar”, horários e mapa. O menu segue essa ordem
(Localização, Horários, Estrutura) mais o botão de WhatsApp; a consulta de planos
fica no convite final. O rodapé repete o endereço, e o `<head>` declara um
JSON-LD `ExerciseGym` com endereço, telefone e horários. O convite final é um
card fotográfico (`overview-05`, raio 28px) com texto branco sobre degradê navy.

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
O WhatsApp flutuante (“Fale conosco”, texto branco sobre `--blue-action`, canto
inferior direito) acompanha a barra do topo: aparece quando a barra fica sólida ao
rolar, permanece em toda a página e some quando a barra some (topo da página, onde o
CTA do hero cumpre esse papel).

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

Toda mudança passa por homologação antes da produção; o passo a passo está no
[README](README.md#fluxo-de-mudança-homologação--produção).
