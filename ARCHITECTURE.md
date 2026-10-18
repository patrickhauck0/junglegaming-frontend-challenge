# Arquitetura e Decisões Técnicas — KURIO NFT Marketplace

Este documento detalha as decisões de engenharia, contratos de comunicação, estratégias de estado assíncrono, resiliência em tempo real, acessibilidade e auditorias de performance do **KURIO NFT Marketplace**, cumprindo integralmente as Seções 4, 5, 6, 7, 8, 10 e 12 do [`README.md`](./README.md).

---

## 1. Visão Geral da Arquitetura

O KURIO NFT Marketplace foi construído como uma aplicação SPA (Single Page Application) moderna em React 18 e TypeScript com foco em máxima fidelidade visual (pixel-perfect 1:1 ao Figma), robustez contra falhas de rede, consistência em tempo real e performance exemplar.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          INTERFACE (React 18)                          │
│     TanStack Router  │  Tailwind CSS  │  shadcn/ui (Radix UI)          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                      CAMADA DE ESTADO ASSÍNCRONO                       │
│    TanStack Query v5 (Cache, Optimistic Updates, AbortSignal)          │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   │ REST (Axios)                    │ Socket.IO Client
                   │                                 │
┌──────────────────▼─────────────────────────────────▼───────────────────┐
│                      CAMADA DE REDE E MOCKS (MSW)                      │
│   Mock Service Worker (Service Worker)                             │
│   - Handlers REST (/api/* com persistência e simulação de cenários)   │
│   - @mswjs/socket.io-binding (Interceptação WebSocket pura)            │
│   - Banco em memória isolado (INITIAL_USERS, NFTS, CARTS, ORDERS)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Contratos REST e Eventos de Tempo Real

### 2.1. Contratos REST

A camada de dados comunica-se via JSON sobre HTTP, com respostas tipadas compartilhadas entre cliente e mock em `src/contracts/`.

| Recurso | Método | Endpoint | Payload / Params | Status Sucesso | Códigos de Erro | Descrição |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Sessão** | `POST` | `/api/auth/register` | `{ name, email, password }` | `201 Created` | `400`, `409` | Cadastro com validação e detecção de e-mail duplicado. |
| **Sessão** | `POST` | `/api/auth/login` | `{ email, password }` | `200 OK` | `400`, `401` | Autenticação retornando usuário e token de sessão. |
| **Sessão** | `GET` | `/api/auth/me` | *Header Authorization* | `200 OK` | `401` | Consulta dados da sessão ativa. |
| **Sessão** | `POST` | `/api/auth/logout` | *Header Authorization* | `200 OK` | `401` | Encerramento de sessão com invalidação. |
| **NFTs** | `GET` | `/api/nfts` | `search, collections, networks, minPrice, maxPrice, tab, sortBy, page, limit` | `200 OK` | `500` | Listagem com paginação e metadados (`total`, `totalPages`). |
| **NFTs** | `GET` | `/api/nfts/:id` | `id` (slug ou ID numérico) | `200 OK` | `404`, `500` | Detalhes completos do NFT e miniaturas da galeria. |
| **Favoritos** | `GET` | `/api/favorites` | *Header Authorization* | `200 OK` | `401` | Lista de IDs de NFTs favoritados pelo usuário. |
| **Favoritos** | `POST` | `/api/favorites/:id` | `{ isFavorited: boolean }` | `200 OK` | `401`, `500` | Alternância de favorito com suporte a erro para teste de rollback. |
| **Carrinho** | `GET` | `/api/cart` | *Bearer ou Header X-Guest-Id* | `200 OK` | `200` | Consulta os itens do carrinho do usuário/visitante. |
| **Carrinho** | `POST` | `/api/cart/items` | `{ nftId, quantity, edition }`| `200 OK` | `400`, `409` | Adiciona item ou incrementa quantidade respeitando estoque. |
| **Carrinho** | `PATCH` | `/api/cart/items/:id`| `{ quantity }` | `200 OK` | `400`, `409` | Atualiza quantidade com validação de limite disponível. |
| **Carrinho** | `DELETE`| `/api/cart/items/:id`| - | `200 OK` | `404` | Remove item específico do carrinho. |
| **Carrinho** | `POST` | `/api/cart/merge` | `{ guestId }` | `200 OK` | `401` | Realiza merge dos itens de visitante no login. |
| **Cotação** | `POST` | `/api/cart/coupon` | `{ code }` | `200 OK` | `400` | Valida cupons (`KURIO10`, `ETH5`, `GREENMINT`) e cupons expirados. |
| **Pedidos** | `POST` | `/api/orders` | `{ items, walletId, network, couponCode }` + *Header Idempotency-Key* | `201 Created` | `400`, `409`, `422` | Criação idempotente do pedido e simulação de pagamento. |
| **Pedidos** | `GET` | `/api/orders/:id` | *Header Authorization* | `200 OK` | `401`, `403`, `404`| Consulta estado (`pending`, `confirmed`, `declined`) e recibo imutável. |
| **Perfil** | `GET` | `/api/profile` | *Header Authorization* | `200 OK` | `401` | Consulta dados cadastrais, bio e avatar. |
| **Perfil** | `PATCH` | `/api/profile` | `{ name, bio, avatarUrl }` | `200 OK` | `400`, `401` | Atualização de perfil do colecionador. |
| **Perfil** | `POST` | `/api/profile/password`| `{ currentPassword, newPassword }` | `200 OK` | `400`, `401` | Alteração de senha com validação de complexidade. |
| **Carteiras**| `GET` | `/api/wallets` | *Header Authorization* | `200 OK` | `401` | Lista carteiras cadastradas do usuário. |
| **Carteiras**| `POST` | `/api/wallets` | `{ name, address, network, isPrimary }` | `201 Created` | `400`, `409` | Cadastro de nova carteira com validação de formato `0x`. |
| **Carteiras**| `PATCH` | `/api/wallets/:id` | `{ isPrimary, network }` | `200 OK` | `400`, `404` | Alterna carteira principal e rede vinculada. |

### 2.2. Contratos de Eventos Socket.IO

Os eventos de tempo real utilizam o cliente `socket.io-client` interceptado no Service Worker pelo `@mswjs/socket.io-binding`. Todo evento carrega identidade única (`eventId`), carimbo de tempo (`timestamp`) e número sequencial de versão (`version`):

#### Evento `nft.updated`
Disparado quando a cotação de um NFT é alterada na rede ou quando edições se esgotam:
```json
{
  "eventId": "evt_nft_01_v2",
  "type": "nft.updated",
  "version": 2,
  "timestamp": "2026-10-18T14:30:00.000Z",
  "data": {
    "nftId": "nft_01",
    "priceEth": "2.45",
    "availableEditions": 8
  }
}
```

#### Evento `order.updated`
Disparado para notificar a transição do estado de processamento de um pedido (ex: de `pending` para `confirmed` ou `declined`):
```json
{
  "eventId": "evt_ord_987_v2",
  "type": "order.updated",
  "version": 2,
  "timestamp": "2026-10-18T14:30:05.000Z",
  "data": {
    "orderId": "ord_987",
    "status": "confirmed",
    "userId": "user_1",
    "txHash": "0x4a9f...c812"
  }
}
```

---

## 3. Política de Sessão, Autenticação e Proteção de Rotas

1. **Tokens e Persistência:**
   - A autenticação baseia-se em Bearer Tokens (`token_user_1`, `token_user_2`).
   - O token ativo e os dados públicos do usuário são persistidos no `localStorage` sob a chave `__kurio_auth_user__`.
   - Ao iniciar, a aplicação valida a sessão com a API (`GET /api/auth/me`).

2. **Interceptação de Falhas e Expiração de Sessão:**
   - O cliente Axios centralizado em `src/lib/axios.ts` intercepta qualquer resposta `HTTP 401 Unauthorized`.
   - Em caso de 401, limpa os dados da sessão, redefine o cache do TanStack Query e redireciona o usuário para `/login?redirect={pathname}` preservando os parâmetros de busca para retomada imediata pós-login.

3. **Guarda de Rotas (TanStack Router `beforeLoad`):**
   - As rotas privadas (`/payment`, `/orders/$id`, `/profile`, `/wallets`, `/favorites`) possuem verificação estrita em `beforeLoad`:
     ```typescript
     beforeLoad: ({ location }) => {
       const user = getStoredAuthUser();
       if (!user) {
         throw redirect({
           to: '/login',
           search: { redirect: location.href },
         });
       }
     }
     ```

4. **Isolamento de Dados e Limpeza no Logout:**
   - No logout (`useAuth().logout()`), executa-se obrigatoriamente:
     1. Chamada a `POST /api/auth/logout`.
     2. Limpeza do `localStorage` (`token` e dados do usuário).
     3. Invalidação e limpeza total do cache remoto via `queryClient.clear()`.
     4. Fechamento da conexão Socket.IO anterior para evitar vazamento de notificações de tempo real entre diferentes contas.

---

## 4. Estado do Carrinho e Precisão Financeira em ETH

1. **Carrinho de Visitante e Merge no Login:**
   - Visitantes não autenticados recebem um identificador pseudo-anônimo (`guestId`) armazenado em `localStorage`.
   - Todas as operações no carrinho de visitante trafegam com o header `X-Guest-Id`.
   - Ao autenticar ou registrar conta, dispara-se automaticamente a mutação `POST /api/cart/merge` com o `guestId`, migrando todos os itens selecionados para a conta autenticada sem duplicar quantidades.

2. **Precisão Financeira via `BigInt` (Wei):**
   - Valores em Ethereum são propensos a erros clássicos de arredondamento de ponto flutuante IEEE 754 (ex: `0.1 + 0.2 = 0.30000000000000004`).
   - O projeto implementa precisão matemática absoluta em `src/utils/eth-math.ts`, convertendo strings decimais em unidades mínimas de Wei ($10^{18}$ wei = 1 ETH) utilizando `BigInt` nativo do JavaScript:
     - `addEth(a, b)`: soma exata em wei.
     - `subtractEth(a, b)`: subtração garantindo não-negatividade.
     - `multiplyEthByQuantity(eth, qty)`: multiplicação inteira precisa.
     - `compareEth(a, b)`: comparação de ordenação precisa.

3. **Remoção Pós-Compra:**
   - Após a conclusão bem-sucedida do checkout, a aplicação não limpa cegamente o carrinho; apenas os itens e quantidades efetivamente adquiridos na transação são removidos, preservando outros itens que o colecionador tenha mantido no carrinho.

---

## 5. Estratégia de Cache, Atualizações Otimistas e Idempotência

1. **TanStack Query e Cancelamento com `AbortSignal`:**
   - Todas as consultas passam o `signal` do TanStack Query diretamente para a requisição Axios.
   - Quando o usuário digita na busca ou altera filtros rapidamente, requisições obsoletas em voo são imediatamente abortadas no navegador, evitando condições de corrida (*race conditions*).

2. **Query Keys Isoladas:**
   - O cache é particionado com precisão: `['nfts', filters]`, `['nft', id]`, `['favorites', userId]`, `['cart', userId]`, `['order', orderId]`.
   - Mudanças de conta ou usuário invalidam exclusivamente os dados pertinentes.

3. **Atualização Otimista com Rollback (Favoritos):**
   - A ação de favoritar/desfavoritar em `src/hooks/useNfts.ts` aplica atualização otimista instantânea na interface:
     ```typescript
     onMutate: async ({ nftId, isFavorited }) => {
       await queryClient.cancelQueries({ queryKey: ['favorites'] });
       const previousFavorites = queryClient.getQueryData(['favorites']);
       queryClient.setQueryData(['favorites'], (old) => /* atualiza imediatamente */);
       return { previousFavorites };
     },
     onError: (err, variables, context) => {
       // Rollback automático para o estado anterior
       if (context?.previousFavorites) {
         queryClient.setQueryData(['favorites'], context.previousFavorites);
       }
     }
     ```

4. **Chave de Idempotência no Checkout:**
   - A criação de pedidos (`POST /api/orders`) gera uma chave de idempotência baseada no timestamp e hash dos itens do carrinho, armazenando-a no `sessionStorage`.
   - Em caso de cliques repetidos do usuário ou timeout de conexão, o cabeçalho `Idempotency-Key` é reenviado.
   - O mock identifica a chave: se o payload for idêntico, retorna o mesmo pedido sem duplicar cobrança; se os itens foram alterados sob a mesma chave, retorna erro `HTTP 409 Conflict`.

---

## 6. Reconciliação entre REST e Socket.IO

1. **Deduplicação de Eventos:**
   - O cliente de socket mantém um cache circular (`Set<string>`) dos últimos 500 `eventId` recebidos. Eventos duplicados transmitidos pela rede são sumariamente descartados.

2. **Controle Estrito de Versão (`version`):**
   - Cada recurso no cliente registra a versão mais recente recebida. Se chegar um evento com `version <= lastVersion`, o evento é ignorado, prevenindo regressão de estado por mensagens fora de ordem.

3. **Reconciliação no Reconnect:**
   - Ao restabelecer a conexão WebSocket (`socket.on('connect')`), os hooks ativos disparam uma revalidação automática via REST (`refetch()`), garantindo sincronia mesmo se eventos foram perdidos durante a desconexão.

4. **Transporte no MSW:**
   - Configurado estritamente com `transports: ['websocket']`, dispensando fallbacks de HTTP long-polling que contornam o interceptor do Service Worker.
   - *Limitação do Mock:* O estado em tempo real é sustentado em memória na aba do navegador/Worker; recargas completas (F5) recuperam o estado persistido no `localStorage`.

---

## 7. Decisões de UX, Acessibilidade e Adaptações ao Figma

1. **Acessibilidade (WCAG 2.1 AA):**
   - Navegação por teclado completa (`Tab` e `Shift+Tab`) com anéis de foco visíveis em todos os elementos interativos.
   - Controle de foco e fechamento por `Escape` em modais e drawers implementados via Radix UI (`Dialog`, `Sheet`).
   - Região `aria-live="polite"` no DOM para avisos sonoros de alterações de preço em tempo real.
   - Skeletons com Shimmer effect dotados de `role="status"` e `aria-label="Carregando..."` sem causar deslocamento de layout (CLS zero).

2. **Adaptações Elegantes para Mobile (Sem Frame Específico no Figma):**
   - **Perfil do Colecionador (`/profile`):** Navegação entre abas em botões pill horizontais, área de upload de avatar compacta e formulário com espaçamento vertical touch-friendly (44px de área de toque mínima).
   - **Carteiras (`/wallets`):** Card âmbar da carteira principal ocupando a largura total (358px), seletor de rede com dropdown nativo estilizado e botões de remoção/alternância com confirmação acessível.
   - **Confirmação de Pedido (`/orders/$id`):** Layout em cupom/recibo com bordas arredondadas e linhas divisórias pontilhadas, hash de transação com truncamento visual inteligente e botão de cópia com feedback tátil.

---

## 8. Auditoria de Qualidade e Performance (Lighthouse)

Auditorias oficiais executadas com o script automatizado [`scripts/lighthouse-audit.mjs`](./scripts/lighthouse-audit.mjs) contra o servidor de preview com build otimizado (`npm run build && npm run preview`).

### 8.1. Ambiente e Ferramentas
- **Sistema Operacional:** Windows 11 (win32 x64)
- **Node.js:** v22.x
- **Lighthouse:** v12.x (Chrome Headless)
- **Vite:** v6.4.4
- **Playwright:** v1.49.1

### 8.2. Resultados Consolidados (3 Medições e Mediana)

| Página Auditada | Perfil de Execução | Performance (Meta ≥ 90) | Acessibilidade (Meta ≥ 95) | Melhores Práticas (Meta ≥ 95) | SEO (Meta ≥ 90) | LCP (s) | CLS | TBT (ms) | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Início (`/`)** | **Desktop (`1440x900`)** | **99** (99, 100, 99) | **95** (95, 95, 95) | **96** (96, 96, 96) | **92** (92, 92, 92) | 0.75s | 0.0029 | 0ms | ✅ **APROVADO** |
| **Início (`/`)** | **Mobile (`390x844`)** | **98** (98, 98, 99) | **95** (95, 95, 95) | **96** (96, 96, 96) | **92** (92, 92, 92) | 2.14s | 0.0004 | 0ms | ✅ **APROVADO** |
| **Detalhes (`/nfts/nft_01`)** | **Desktop (`1440x900`)** | **99** (99, 99, 99) | **96** (96, 96, 96) | **96** (96, 96, 96) | **92** (92, 92, 92) | 0.83s | 0.0001 | 0ms | ✅ **APROVADO** |
| **Detalhes (`/nfts/nft_01`)** | **Mobile (`390x844`)** | **98** (98, 98, 98) | **95** (95, 95, 95) | **96** (96, 96, 96) | **92** (92, 92, 92) | 2.11s | 0.0057 | 0ms | ✅ **APROVADO** |

*Relatórios completos em HTML e JSON versionados em [`lighthouse-reports/`](./lighthouse-reports/).*
