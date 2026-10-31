# Styllus Fitness Center — site

Site estático (Vite + JS vanilla) da Styllus Fitness Center: a home e a página
`/links`. Publicado no GitHub Pages em https://styllusfitness.com.br a cada push
na `main`.

Regras do projeto (marca, contatos, imagens, tema) ficam em [AGENTS.md](AGENTS.md),
[BRAND.md](BRAND.md) e [DESIGN.md](DESIGN.md).

## Comandos

```bash
npm ci                    # dependências
npm run dev               # servidor de desenvolvimento
npm test                  # conteúdo, contatos, contraste e assets
npm run test:responsive   # Playwright: celular, tablet e desktop
npm run build             # build de produção em dist/
npm run test:production   # build servido na raiz e em subdiretório
```

## Fluxo de mudança: homologação → produção

Nada vai direto para a `main`: push na `main` publica na hora.

1. **Trabalhe na branch `homologacao`**, atualizada com a produção:

   ```bash
   git switch homologacao
   git merge --ff-only main
   ```

2. **Implemente com teste primeiro** e rode tudo:

   ```bash
   npm test && npm run test:responsive && npm run build && npm run test:production
   ```

3. **Suba a homologação** no devhub (servidor local + Cloudflare Tunnel):

   ```bash
   # servidor do build, só em loopback, rodando fora da sessão do terminal
   systemd-run --user --unit styllus-homologacao --working-directory="$PWD" \
     --setenv=PATH="$PATH" npx vite preview --host 127.0.0.1 --port 4181 --strictPort

   # endereço público via túnel (use a skill cloudflare-ncls para o ID do túnel
   # e, se a revisão for privada, para criar a proteção de acesso antes)
   cf-tunnel ingress add styllus-homologacao.ncls.cc http://127.0.0.1:4181
   cf-tunnel dns add styllus-homologacao CNAME <TUNNEL_ID>.cfargotunnel.com --proxied
   cf-tunnel verify styllus-homologacao.ncls.cc
   ```

   Para atualizar depois de novas mudanças: `npm run build` e
   `systemctl --user restart styllus-homologacao`.

4. **Valide** em https://styllus-homologacao.ncls.cc no celular e no desktop.

5. **Publique** só com aprovação:

   ```bash
   git push origin homologacao
   git switch main
   git merge --no-ff homologacao
   git push origin main        # dispara o deploy do GitHub Pages
   gh run watch                # acompanhe até concluir
   ```

6. **Derrube a homologação**:

   ```bash
   cf-tunnel dns rm styllus-homologacao.ncls.cc
   cf-tunnel ingress rm styllus-homologacao.ncls.cc
   cf-tunnel access rm styllus-homologacao.ncls.cc   # só se criou proteção
   systemctl --user stop styllus-homologacao
   ```

Commits saem com a identidade git global do devhub, sem coautor de agente.

> Testes Playwright: emule movimento reduzido com
> `test.use({ contextOptions: { reducedMotion: "reduce" } })` ou
> `page.emulateMedia({ reducedMotion: "reduce" })`. A opção `reducedMotion`
> direta no `test.use` é ignorada nesta versão do Playwright.
