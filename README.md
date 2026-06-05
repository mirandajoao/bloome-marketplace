# Bloomé React Marketplace

Aplicação completa em React para a loja Bloomé, focada em perfumes, body splash, produtos de beleza e cuidado feminino.

## O que este projeto tem

- Front-end em React + Vite.
- Catálogo de produtos.
- Busca por nome, descrição e categoria.
- Página de detalhes do produto.
- Carrinho de compras.
- Checkout com abertura automática do WhatsApp.
- Painel administrativo.
- Cadastro, edição e remoção de produtos.
- Controle de pedidos.
- Configurações da loja, WhatsApp e Pix.
- Banco de dados simulado com `localStorage`.
- Pronto para hospedar gratuitamente na Vercel.

## Importante sobre o localStorage

Este projeto não usa servidor nem banco externo. Os dados ficam salvos no navegador de quem acessa.

Isso é ótimo para um MVP, catálogo inicial, demonstração e validação da loja. Porém, para uma loja real com vários clientes, o ideal depois é evoluir para um banco online, como Supabase, Firebase ou outro backend.

## Como rodar online pelo navegador

Você pode usar:

- StackBlitz
- CodeSandbox
- Replit
- GitHub Codespaces

Fluxo simples:

1. Crie um novo projeto React/Vite.
2. Envie estes arquivos.
3. Rode `npm install`.
4. Rode `npm run dev`.

## Como rodar localmente, caso um dia precise

```bash
npm install
npm run dev
```

## Como gerar versão de produção

```bash
npm run build
```

A pasta gerada será `dist`.

## Como publicar na Vercel

1. Crie uma conta na Vercel.
2. Envie este projeto para um repositório no GitHub.
3. Clique em `Add New Project` na Vercel.
4. Selecione o repositório.
5. Framework: Vite.
6. Build Command: `npm run build`.
7. Output Directory: `dist`.
8. Clique em Deploy.

## Login do painel administrativo

E-mail:

```text
admin@bloome.com
```

Senha:

```text
bloome123
```

## Onde alterar o WhatsApp da loja

Acesse no próprio site:

```text
Admin > Configurações > WhatsApp com DDI e DDD
```

Exemplo:

```text
5591988887777
```

## Estrutura do projeto

```text
bloome-react/
  public/
    assets/
      logos e identidade visual
  src/
    main.jsx
    styles.css
    storage.js
  index.html
  package.json
  vercel.json
```

## Próximas melhorias recomendadas

- Integrar banco online com Supabase.
- Criar autenticação real para administradora.
- Integrar pagamento com Mercado Pago.
- Criar domínio próprio.
- Adicionar cálculo de frete.
- Adicionar upload real de imagens.
