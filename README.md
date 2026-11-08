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

Nada vai direto para a `main`: um push na `main` publica na hora.

1. **Trabalhe na branch `homologacao`**, atualizada com a produção:

   ```bash
   git switch homologacao
   git merge --ff-only main
   ```

2. **Implemente com teste primeiro** e rode tudo:

   ```bash
   npm test && npm run test:responsive && npm run build && npm run test:production
   ```

3. **Revise o resultado** no build local:

   ```bash
   npm run build && npm run preview
   ```

   Confira no celular e no desktop antes de seguir.

4. **Publique** só com aprovação:

   ```bash
   git push origin homologacao
   git switch main
   git merge --no-ff homologacao
   git push origin main        # dispara o deploy do GitHub Pages
   gh run watch                # acompanhe até concluir
   ```

> Testes Playwright: emule movimento reduzido com
> `test.use({ contextOptions: { reducedMotion: "reduce" } })` ou
> `page.emulateMedia({ reducedMotion: "reduce" })`. A opção `reducedMotion`
> direta no `test.use` é ignorada nesta versão do Playwright.
