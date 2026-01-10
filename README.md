# Rodando o projeto

Instalação das dependências:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Rodando o servidor de desenvolvimento:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Sobre o projeto

Este é um projeto de um e-commerce fictício chamado "AD Commerce". O projeto foi desenvolvido usando Next.js 16.1.1, React 19.2.3, Tailwind CSS 4, Shadcn UI e Lucide React.

## Funcionalidades

- Listagem de produtos
- Detalhes do produto
- Carrinho de compras
- Checkout

## Tecnologias usadas

- Next.js 16.1.1 - A escolha do Next.js foi feita por conta da sua performance e facilidade de uso.
- Tailwind CSS 4 - A escolha foi feita por conta do mobile first e praticidade ao estilizar o projeto.
- Shadcn UI - A escolha do design system foi feita para dar um visual moderno e consistente ao projeto.
- Commitizen - Essa lib foi escolhida para facilitar o commit dos commits e garantir que o commit tenha um formato padrão.
- Axios - Essa lib foi escolhida para fazer as requisições à API com tratamento de erros e response data.
- Jest - Essa lib foi escolhida para testar o projeto e garantir que o projeto funcione corretamente.
- React Toastify - Essa lib foi escolhida para exibir as notificações de erro e sucesso ao usuário.

## Trade-offs e Decisões Arquiteturais

Este projeto faz uso de várias decisões arquiteturais que envolvem trade-offs. Abaixo estão as principais decisões e suas compensações:

### Server Components vs Client Components

**Decisão:** Uso de Server Components para páginas principais e Client Components apenas quando necessário (interatividade, hooks, etc.)

**Trade-offs:**

- ✅ **Prós:** Melhor performance inicial, menor bundle JavaScript, SEO otimizado, dados frescos do servidor
- ❌ **Contras:** Limitações em interatividade, não pode usar hooks do React diretamente, requer Client Components para estados e eventos

**Exemplo:** A página de listagem de produtos (`/app/page.tsx`) é Server Component, enquanto o filtro de produtos (`ProductFilter`) é Client Component para gerenciar estado de filtros.

### Tratamento de Erros: Toast vs Error Boundaries

**Decisão:** Uso de react-toastify para notificações de erro em tempo real e error boundaries do Next.js para erros críticos

**Trade-offs:**

- ✅ **Prós:** Feedback imediato ao usuário, não interrompe o fluxo da aplicação, melhor UX
- ❌ **Contras:** Erros podem passar despercebidos se o usuário não estiver olhando, requer gerenciamento de estado de erro

**Exemplo:** Erros de API são exibidos via toast, enquanto erros de renderização são capturados por error boundaries.

### Gerenciamento de Estado

**Decisão:** Estado local com `useState` para componentes individuais, sem gerenciamento de estado global

**Trade-offs:**

- ✅ **Prós:** Simplicidade, sem dependências extras, fácil de entender e manter
- ❌ **Contras:** Estado não compartilhado entre componentes, pode levar a prop drilling em casos complexos, carrinho de compras não persiste entre páginas

**Exemplo:** O estado de quantidade no `ProductQuantityControls` é local, não compartilhado com outros componentes.

### Performance de Imagens

**Decisão:** Uso do componente `Image` do Next.js com lazy loading por padrão

**Trade-offs:**

- ✅ **Prós:** Otimização automática de imagens, lazy loading reduz carga inicial, melhor Core Web Vitals
- ❌ **Contras:** Imagens abaixo da dobra podem ter delay no carregamento, requer configuração de domínios externos

**Nota:** Para melhorar LCP, as primeiras imagens poderiam usar `priority={true}`, mas isso foi removido para manter consistência.

### Fetching de Dados: Server vs Client

**Decisão:** Páginas principais fazem fetch no servidor, página de detalhes faz fetch no cliente

**Trade-offs:**

- ✅ **Prós (Server):** Dados frescos, melhor SEO, menor bundle, cache do Next.js
- ✅ **Prós (Client):** Melhor tratamento de erros com toast, loading states mais granulares, não bloqueia renderização
- ❌ **Contras:** Inconsistência na estratégia de fetching, página de detalhes requer JavaScript para funcionar

**Exemplo:** Lista de produtos é Server Component, enquanto detalhes do produto (`ProductDetailClient`) é Client Component para permitir tratamento de erro com toast.

### Design System: Shadcn UI

**Decisão:** Uso do Shadcn UI como base de componentes

**Trade-offs:**

- ✅ **Prós:** Componentes acessíveis, customizáveis, baseados em Radix UI, código no projeto (não é dependência)
- ❌ **Contras:** Requer manutenção manual dos componentes, pode precisar de atualizações manuais, mais arquivos no projeto

### Estilização: Tailwind CSS

**Decisão:** Tailwind CSS 4 para toda a estilização

**Trade-offs:**

- ✅ **Prós:** Desenvolvimento rápido, consistência visual, mobile-first, purge automático
- ❌ **Contras:** Classes podem ficar verbosas, curva de aprendizado, HTML pode ficar poluído

### API Client: Axios

**Decisão:** Axios ao invés de fetch nativo

**Trade-offs:**

- ✅ **Prós:** Interceptors para tratamento global de erros, configuração centralizada, melhor tratamento de erros
- ❌ **Contras:** Bundle maior, dependência extra, fetch nativo seria mais leve

### Notificações: React-toastify

**Decisão:** React-toastify para todas as notificações

**Trade-offs:**

- ✅ **Prós:** Fácil de usar, muitas opções de customização, bom suporte
- ❌ **Contras:** Dependência extra, pode ser substituído por soluções mais leves, requer CSS adicional

### Padronização de Commits: Commitizen

**Decisão:** Commitizen com conventional-changelog para padronizar mensagens de commit

**Trade-offs:**

- ✅ **Prós:** Commits consistentes e semânticos, facilita geração automática de changelog, melhora rastreabilidade do histórico, ajuda na colaboração em equipe
- ❌ **Contras:** Requer instalação e configuração inicial, desenvolvedores precisam aprender o formato, pode ser mais lento que commits diretos, adiciona uma etapa extra no workflow

**Exemplo:** Commits seguem o formato `type(scope): description`, como `feat(products): add product filter component` ou `fix(api): handle 403 error in product fetch`.

### Testes: Jest

**Decisão:** Jest como framework de testes com Testing Library para testes de componentes

**Trade-offs:**

- ✅ **Prós:** Configuração integrada para React/Next.js, cobertura de código nativa, mocks poderosos, boa integração com TypeScript, suporte a snapshots
- ❌ **Contras:** Bundle maior, pode ser mais lento que alternativas como Vitest, configuração inicial mais complexa, requer setup adicional para Next.js (next/jest)

# Futuras melhorias

- Adicionar carrinhos de compras persistentes;
- Adicionar checkout com plataforma de pagamento;
- Adicionar página de favoritos;
- Adicionar página de perfil do usuário;
- Adicionar página de histórico de compras;
- Adicionar pagina de autenticação;
