# KURIO — NFT Marketplace (GreenMint)

> Implementação 1:1 (pixel-perfect) do **NFT Marketplace** em React 18, TypeScript e Tailwind CSS, integrada à stack obrigatória com TanStack Router, TanStack Query, Axios, shadcn/ui, Socket.IO e Mock Service Worker (MSW).
> 
> Documentação técnica detalhada, contratos e decisões de arquitetura disponíveis em [**`ARCHITECTURE.md`**](./ARCHITECTURE.md).

---

## 🚀 Guia de Execução a partir de um Checkout Limpo

### 1. Pré-requisitos
- **Node.js:** Versão 20+ ou 22+ recomendada.
- **NPM:** Versão 10+.

### 2. Instalação e Variáveis de Ambiente
```bash
# 1. Clone o repositório e acesse a pasta raiz
git clone <url-do-repositorio>
cd junglegaming-frontend-challenge

# 2. Instale as dependências (incluindo Playwright e Lighthouse)
npm install

# 3. Configure as variáveis de ambiente (o arquivo .env.example já está pronto para uso)
cp .env.example .env.local
```

### 3. Scripts e Comandos Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite (`http://localhost:5173`) com MSW e WebSockets ativos. |
| `npm run build` | Valida tipagens (`tsc -b`) e compila o bundle de produção otimizado em `dist/`. |
| `npm run preview` | Sobe o servidor local de preview servindo o build de produção em `http://127.0.0.1:4173/`. |
| `npm run typecheck` | Executa a verificação estrita de tipos do TypeScript sem emitir arquivos (`tsc --noEmit`). |
| `npm run lint` | Executa a análise estática com ESLint em toda a pasta `src/`. |
| `npm run test:e2e` | Executa a suíte completa de **51 testes Playwright** (12 cenários funcionais + regressão visual) em Chromium Desktop, Tablet e Mobile. |
| `npm run test:e2e:ui` | Abre o painel interativo do Playwright Test Runner com depuração e inspeção de DOM/Time-travel. |
| `npm run lighthouse` | Executa a auditoria oficial do Lighthouse (3 medições por página/perfil, medianas e relatórios em `lighthouse-reports/`). |

---

## 👥 Credenciais Fictícias de Teste

O banco de dados do MSW possui dois usuários cadastrados para validação de fluxos de login, perfil, carteiras e isolamento de sessão:

| Usuário | E-mail | Senha | Carteira Principal | Saldo Inicial |
| :--- | :--- | :--- | :--- | :---: |
| **Alexandre Hauck** | `alexandre@kurio.art` | `kurio123` | `0x71C2B895C984c3B821A858712e96d9978EbC4982` | `14.50 ETH` |
| **Beatriz Mendes** | `beatriz@kurio.art` | `kurio123` | `0x3F91A429b8214C2361A971182A732104975e54A1` | `8.20 ETH` |

> *Nota:* Qualquer novo cadastro via `/register` cria um novo usuário no banco do MSW com persistência em `localStorage`.

---

## 🎛️ Controle e Seleção de Cenários do MSW

O MSW é executado na camada de rede pelo Service Worker (`public/mockServiceWorker.js`) e intercepta tanto chamadas REST (`/api/*`) quanto conexões WebSocket (`@mswjs/socket.io-binding`).

### Endpoints de Controle para Testes e Demonstração:

1. **Reset Total da Base:**
   ```bash
   curl -X POST http://localhost:5173/api/__test__/reset
   ```
   Restaura integralmente os 32 NFTs, os 2 usuários, carteiras, carrinhos, pedidos e limpa erros forçados.

2. **Configuração de Cenários de Falha:**
   ```bash
   curl -X POST http://localhost:5173/api/__test__/scenario \
     -H "Content-Type: application/json" \
     -d '{"latencyMs": 1500, "errorMode": null, "paymentMode": "confirmed"}'
   ```
   - `latencyMs`: tempo de atraso artificial em milissegundos (ex: `1500`).
   - `errorMode`: `'500'` | `'401'` | `'403'` | `'409'` | `'timeout'` | `null`.
   - `paymentMode`: `'confirmed'` | `'declined'` | `'pending'` | `'timeout'`.

3. **Disparo de Eventos Socket.IO em Tempo Real:**
   - **Atualização de Preço (`nft.updated`):**
     ```bash
     curl -X POST http://localhost:5173/api/__test__/emit-nft-updated \
       -H "Content-Type: application/json" \
       -d '{"nftId": "nft_01", "priceEth": "2.99", "availableEditions": 5}'
     ```
   - **Atualização de Pedido (`order.updated`):**
     ```bash
     curl -X POST http://localhost:5173/api/__test__/emit-order-updated \
       -H "Content-Type: application/json" \
       -d '{"orderId": "<id-do-pedido>", "status": "confirmed"}'
     ```

---

## 🧪 Como Reproduzir os Fluxos de Falha e Resiliência

### 1. Latência Alta e Shimmer Skeletons sem CLS
1. Configure latência de 2 segundos:
   `curl -X POST http://localhost:5173/api/__test__/scenario -H "Content-Type: application/json" -d '{"latencyMs": 2000}'`
2. Recarregue a página `/` ou `/nfts/nft_01`.
3. **Comportamento observado:** A interface exibe os esqueletos pulsantes com efeito shimmer sem causar nenhum salto de layout (Cumulative Layout Shift = 0).

### 2. Falha 500 no Catálogo e Recuperação
1. Ative o modo de erro 500:
   `curl -X POST http://localhost:5173/api/__test__/scenario -H "Content-Type: application/json" -d '{"errorMode": "500"}'`
2. No catálogo (`/`), veja a mensagem de erro amigável com o botão *"Tentar novamente"*.
3. Restaure o cenário:
   `curl -X POST http://localhost:5173/api/__test__/scenario -H "Content-Type: application/json" -d '{"errorMode": null}'`
4. Clique em *"Tentar novamente"*: o catálogo recupera os dados imediatamente sem necessidade de recarregar a página.

### 3. Atualização Otimista com Rollback (Favoritos)
1. Ative o erro 500:
   `curl -X POST http://localhost:5173/api/__test__/scenario -H "Content-Type: application/json" -d '{"errorMode": "500"}'`
2. Na página inicial ou no detalhe do NFT, clique no ícone de coração para favoritar.
3. **Comportamento observado:** O ícone fica preenchido imediatamente (otimista). Quando a API retorna erro 500, o estado reverte suavemente (*rollback*) para desmarcado e uma notificação informa a falha transitória.

### 4. Sessão Expirada com Retomada do Fluxo
1. Faça login com `alexandre@kurio.art` e navegue até `/cart`.
2. No Console do navegador (DevTools), execute `localStorage.removeItem('__kurio_auth_user__')` ou acione um erro 401.
3. Clique em *"Conectar e finalizar"*.
4. **Comportamento observado:** A aplicação bloqueia o acesso à rota privada `/payment`, redireciona para `/login?redirect=%2Fpayment` e, após login, retoma exatamente o checkout com todos os itens do carrinho preservados.

### 5. Cupons Válidos, Inválidos e Expirados
1. No Carrinho (`/cart`), insira no campo de código promocional:
   - `KURIO10`: Aplica 10% de desconto no subtotal.
   - `ETH5`: Aplica desconto fixo de 0.05 ETH.
   - `CUPOMINVALIDO`: Exibe feedback visual de erro informando cupom inexistente.
   - `EXPIRADO2025`: Exibe feedback visual de erro informando cupom fora da validade.

### 6. Mudança de Preço via Socket.IO no Checkout (`nft.updated`)
1. Adicione o NFT *Emerald Ape #042* ao carrinho e avance para `/payment`.
2. Em outro terminal, altere a cotação do NFT em tempo real:
   `curl -X POST http://localhost:5173/api/__test__/emit-nft-updated -H "Content-Type: application/json" -d '{"nftId": "nft_01", "priceEth": "3.50"}'`
3. **Comportamento observado:** Um banner de alerta âmbar surge imediatamente no topo do checkout informando a variação de cotação e o botão de confirmação é bloqueado até que o usuário revise o novo resumo de valores.

### 7. Pagamento Recusado e Prevenção de Duplo Clique
1. Configure o modo de pagamento para recusa:
   `curl -X POST http://localhost:5173/api/__test__/scenario -H "Content-Type: application/json" -d '{"paymentMode": "declined"}'`
2. No pagamento, clique em *"Pagar e confirmar pedido"*.
3. **Comportamento observado:** O botão desabilita exibindo spinner com chave de idempotência fixa. O pedido transiciona para o estado recusado com mensagem amigável e os itens no carrinho são preservados para nova tentativa.

---

## 📊 Resultados dos Testes E2E e Auditoria Lighthouse

### Playwright E2E (`npm run test:e2e`)
- **Total de Testes:** 51
- **Aprovados:** 50 (100% dos testes executados)
- **Cenários Cobertos:** 12 cenários funcionais obrigatórios + Regressão Visual Desktop e Mobile.
- **Relatório HTML e Baselines:** versionados em `playwright-report/` e `tests/e2e/13-visual-regression.spec.ts-snapshots/`.

### Auditoria Lighthouse (`npm run lighthouse`)
- **Início Desktop:** Performance **99** | Acessibilidade **95** | Melhores Práticas **96** | SEO **92** | LCP **0.75s** | CLS **0.0029** | TBT **0ms**
- **Início Mobile:** Performance **98** | Acessibilidade **95** | Melhores Práticas **96** | SEO **92** | LCP **2.14s** | CLS **0.0004** | TBT **0ms**
- **Detalhes Desktop:** Performance **99** | Acessibilidade **96** | Melhores Práticas **96** | SEO **92** | LCP **0.83s** | CLS **0.0001** | TBT **0ms**
- **Detalhes Mobile:** Performance **98** | Acessibilidade **95** | Melhores Práticas **96** | SEO **92** | LCP **2.11s** | CLS **0.0057** | TBT **0ms**

---

# Enunciado do Desafio Original

O desafio avalia fidelidade visual, qualidade das interações, integração com APIs, gerenciamento de estado assíncrono, tempo real, acessibilidade e performance.

## 1. Escopo

Entregue os fluxos de descoberta, compra e conta do colecionador, com versões desktop e mobile. APIs, autenticação, carteiras e pagamentos devem funcionar com dados simulados. Integrações reais com blockchain, extensões de carteira e gateways de pagamento estão fora do escopo.

O Figma define a identidade visual e a composição das telas. Este enunciado define os comportamentos e os cenários de avaliação. Estados não desenhados devem seguir o mesmo padrão visual.

## 2. Stack obrigatória

| Responsabilidade | Tecnologia |
| --- | --- |
| Interface | React |
| Linguagem | TypeScript |
| Roteamento | TanStack Router |
| Estado remoto | TanStack Query |
| Cliente HTTP | Axios |
| Integração de dados | REST APIs |
| Tempo real | Socket.IO |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui |
| Mocking | MSW |
| Testes E2E e regressão visual | Playwright |
| Auditoria de performance e qualidade | Lighthouse |

As tecnologias devem participar efetivamente da solução. A ferramenta de build, a organização do projeto e as bibliotecas complementares ficam a critério do candidato.

## 3. Telas e fluxos

| Tela | Funcionalidades obrigatórias |
| --- | --- |
| Início | Destaques, catálogo, busca, filtros, ordenação e navegação para o NFT |
| Detalhes do NFT | Galeria, informações, edição, quantidade, favoritos e compra |
| Carrinho de NFTs | Edição de quantidades, remoção, cupom e resumo de valores |
| Pagamento | Dados do colecionador, seleção de carteira e rede, revisão e envio do pedido |
| Confirmação de pedido | Resultado, identificação da transação, itens, taxas e total |
| Login | Autenticação, validação e retorno ao fluxo anterior |
| Cadastro | Criação de conta, validação e tratamento de conflito |
| Perfil do colecionador | Edição dos dados, avatar e alteração de senha |
| Carteiras | Cadastro e edição de carteiras principal e secundária |

Implemente os frames desktop e mobile disponíveis. Perfil, carteiras e confirmação também devem funcionar em mobile, mesmo sem um frame específico.

Páginas editoriais, suporte, atividade, ofertas e downloads não fazem parte da entrega. Links externos e ações auxiliares devem ter comportamento coerente; ações fora do escopo não devem aparentar sucesso funcional.

### Catálogo e detalhe

- Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico.
- Filtros devem ser combináveis; mudança de filtro deve reiniciar a paginação.
- As consultas devem refletir os parâmetros enviados à API, com tratamento de resultados vazios, falhas e respostas fora de ordem.
- O detalhe deve suportar acesso direto, NFT inexistente, edição indisponível e limite de quantidade.
- Favoritos devem persistir para o usuário autenticado.

### Carrinho

- Adicionar, alterar e remover itens, respeitando a disponibilidade por NFT e edição.
- Manter o carrinho após refresh e preservar os itens do visitante ao autenticar.
- Aplicar e remover cupom, com tratamento de código inválido ou expirado.
- Exibir subtotal, desconto, taxa de rede e total coerentes com a resposta da API.
- Refletir alterações de preço e disponibilidade recebidas enquanto o carrinho estiver aberto.

Valores em ETH devem trafegar como strings decimais e manter precisão nos cálculos e na apresentação. Quantidades são inteiras. A cotação da API é a referência para finalizar o pedido.

### Pagamento e confirmação

- Validar os campos do layout e permitir revisão antes do envio.
- Utilizar as carteiras cadastradas, com seleção de rede e simulação de conexão, recusa e desconexão.
- Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra. Mudanças devem exigir nova confirmação do usuário.
- Impedir pedidos duplicados em cliques repetidos ou reenvios após timeout.
- Representar pedido pendente, confirmado e recusado, com recuperação após refresh ou reconexão.
- Exibir a confirmação somente para pedido efetivamente confirmado na simulação.
- Preservar os itens em falhas; após confirmação, remover do carrinho apenas os itens e quantidades comprados.

O recibo deve reproduzir o snapshot do pedido. Alterações posteriores no catálogo não podem modificar seus valores. Referências de transação e links de exploração são simulados.

### Conta e sessão

Cadastro, login, logout e sessão são obrigatórios, integrados à API simulada. Checkout, perfil, carteiras, favoritos e pedidos exigem autenticação.

A sessão deve ser recuperável após refresh. Trate expiração durante a navegação e durante o checkout, preservando o contexto para retomada. Logout e troca de usuário devem limpar dados privados em cache e subscriptions da sessão anterior.

Valide os formulários de cadastro, perfil, senha e carteiras, incluindo erros retornados pela API. Alterações confirmadas devem permanecer após refresh. Use credenciais fictícias e não armazene senhas em claro.

## 4. Integração e estado

Use TanStack Router nas rotas, parâmetros de busca e proteção dos fluxos privados. Use TanStack Query nas consultas, mutations e sincronização do cache. As chamadas REST devem passar pelo Axios.

A solução deve garantir:

- contratos tipados entre transporte, estado e interface;
- estados de carregamento, vazio, erro, sucesso e atualização em segundo plano;
- invalidação coerente após mutations e eventos;
- cancelamento ou descarte de respostas obsoletas;
- isolamento dos dados por usuário e pelos parâmetros da consulta;
- recuperação de falhas sem duplicar operações;
- tratamento de rotas inexistentes e acesso direto a qualquer tela prevista.

Aplique atualização otimista em pelo menos uma interação, com rollback em caso de falha. A política de cache, retries e sincronização deve ser documentada.

## 5. Contratos REST

Defina e documente os contratos utilizados. Os recursos mínimos são:

| Recurso | Operações |
| --- | --- |
| Sessão e conta | Cadastro, login, consulta da sessão, logout e expiração |
| NFTs | Listagem com busca/filtros/ordenação/paginação e detalhe por identificador |
| Favoritos | Consulta, inclusão e remoção |
| Carrinho | Consulta, inclusão, alteração e remoção de itens |
| Cotação | Validação de cupom, disponibilidade, descontos, taxas e total |
| Pedidos | Criação idempotente e consulta do estado e recibo |
| Perfil | Consulta, atualização de dados/avatar e alteração de senha |
| Carteiras | Consulta, cadastro e atualização |

As respostas devem representar erros de validação, sessão inválida, falta de permissão, recurso inexistente, conflito de disponibilidade e falha transitória.

As mutations de pedido devem aceitar uma chave de idempotência. Na simulação, a mesma tentativa deve recuperar o mesmo pedido; reutilizar a chave com conteúdo diferente deve gerar conflito.

## 6. Mocking com MSW

Implemente os mocks na camada de rede, reutilizando contratos e cenários entre desenvolvimento, demonstração e testes. Componentes, hooks e cliente Axios não devem conter respostas fictícias ou caminhos alternativos de negócio.

Os mocks devem manter estado consistente entre catálogo, favoritos, carrinho, perfil, carteiras e pedidos. Persistência local é permitida para sustentar refresh; o reset deve restaurar integralmente um cenário conhecido.

### Simulating Network Conditions and Failures

Simule condições de rede e falhas com MSW, incluindo lentidão, latência variável, timeouts, indisponibilidade de conexão e respostas HTTP de erro. Os cenários devem ser configuráveis e reproduzíveis, permitindo avaliar o carregamento, o feedback de erro e a recuperação da interface.

Disponibilize fixtures com variedade suficiente para exercitar filtros e paginação, pelo menos dois usuários e cenários determinísticos de:

- sucesso e resultado vazio;
- latência variável e respostas fora de ordem;
- falhas de conexão e respostas HTTP 4xx/5xx;
- sessão expirada e acesso não autorizado;
- conflito de cadastro ou de validação de formulário;
- cupom inválido ou expirado;
- preço alterado ou edição esgotada durante a compra;
- timeout após criação do pedido, com recuperação por idempotência;
- pagamento confirmado e pagamento recusado.

Use MSW também na simulação dos eventos, com uma integração compatível com o protocolo Socket.IO, como [@mswjs/socket.io-binding](https://github.com/mswjs/socket.io-binding). Documente o transporte utilizado e suas limitações no ambiente de mocks.

Os cenários devem exercitar `socket.io-client`. Substituir o socket por chamadas diretas a setters, callbacks ou ao cache não atende ao requisito.

A camada de mocks deve ser ativada por configuração e estar disponível no build de demonstração. Mudanças nos dados simulados devem ser refletidas tanto nas respostas REST quanto nos eventos correspondentes.

## 7. Tempo real com Socket.IO

Implemente, no mínimo, os seguintes eventos:

| Evento | Comportamento esperado |
| --- | --- |
| `nft.updated` | Atualizar preço e disponibilidade no catálogo, detalhe e carrinho |
| `order.updated` | Atualizar o estado do pedido e apresentar confirmação ou recusa |

Os eventos devem carregar identidade estável, recurso afetado e versão. O cliente deve tolerar duplicatas e eventos antigos, sem regredir um estado mais recente nem reaplicar efeitos.

Após reconexão, reconcilie os recursos ativos com a API REST. Eventos de uma sessão anterior não podem atualizar dados de outro usuário. Listeners e subscriptions devem ser liberados ao encerrar seu ciclo de vida.

Implemente o cenário:

1. Um NFT está no carrinho.
2. Seu preço ou disponibilidade muda durante a navegação.
3. A interface informa a alteração e atualiza o resumo.
4. O checkout impede a confirmação com uma cotação desatualizada.

Também deve funcionar uma interrupção de conexão enquanto o pedido está pendente. Após reconectar ou recarregar a página, o usuário deve recuperar seu estado sem criar outra compra. Pedidos confirmados ou recusados são terminais.

## 8. Interface, responsividade e acessibilidade

Preserve tipografia, cores, espaçamentos, hierarquia, imagens, proporções e composição do Figma. Adapte os componentes shadcn/ui à identidade visual do projeto.

Todas as telas devem funcionar em desktop, tablet e mobile, com atenção a filtros, navegação, formulários, carrinho e checkout. Avalie, no mínimo, larguras de 390, 768 e 1440 pixels.

Use **skeletons com shimmer effect** nos componentes dependentes de dados durante o carregamento, incluindo catálogo, detalhe e resumo do carrinho. Preserve as dimensões do conteúdo para evitar deslocamentos de layout e respeite a preferência por movimento reduzido.

São obrigatórios:

- navegação por teclado e foco visível;
- controle de foco em diálogos e drawers;
- semântica adequada, labels e mensagens de erro associadas aos campos;
- alternativas textuais para imagens relevantes;
- contraste legível e estados não dependentes apenas de cor;
- feedback acessível para mutations e alterações em tempo real;
- ausência de overflow horizontal indevido e perda de conteúdo com zoom.

Use os assets do arquivo quando disponíveis e mantenha imagens e fontes necessárias acessíveis à execução local. Documente qualquer substituição de asset ou ajuste de acessibilidade em relação ao layout.

## 9. Testes com Playwright

Entregue testes E2E executáveis com os mocks, cobrindo:

1. Busca, filtros combinados, ordenação, paginação e restauração pelo histórico.
2. Acesso direto ao detalhe e tratamento de recurso inexistente.
3. Cadastro, login, expiração de sessão, logout e troca de usuário.
4. Favoritos, incluindo falha de mutation e recuperação do estado.
5. Carrinho, quantidades, remoção, cupom e persistência após refresh/login.
6. Compra completa, do catálogo ao recibo confirmado.
7. Falha de pagamento, clique repetido e timeout com recuperação do mesmo pedido.
8. Edição de perfil, avatar, senha e carteiras, com erros de validação.
9. Alteração de preço/disponibilidade via Socket.IO durante o checkout.
10. Eventos duplicados ou antigos, desconexão e retomada de pedido pendente.
11. Navegação por teclado, foco de diálogos e validação de formulários.
12. Skeletons durante carregamento lento, feedback de falha e recuperação após nova tentativa.

Execute os fluxos principais em Chromium, nos viewports desktop e mobile. Inclua regressão visual de início, detalhe, carrinho e pagamento, com baselines versionadas e dados estáveis.

Cada teste deve partir de um estado isolado. Controle relógio, latência e disparo dos eventos nos cenários sensíveis a tempo. Entregue relatório HTML e traces das falhas.

As verificações devem observar a interface e os resultados das operações. Os testes de tempo real precisam passar pelo cliente Socket.IO e os de REST pelos handlers MSW.

## 10. Performance e Lighthouse

Audite início e detalhe do NFT com Lighthouse em perfis mobile e desktop, usando build otimizado e o cenário padrão dos mocks.

| Categoria | Meta |
| --- | ---: |
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |

Execute três medições por página e perfil e reporte a mediana de cada categoria. Versione a configuração da auditoria e entregue relatórios HTML/JSON, versões das ferramentas, ambiente e condições de execução.

Registre LCP, CLS e TBT. Justifique resultados abaixo das metas e identifique as causas. A auditoria deve carregar as imagens, fontes e funcionalidades da entrega, sem simplificações exclusivas para melhorar a pontuação.

## 11. Critérios de avaliação

| Critério | Pontos | Evidência esperada |
| --- | ---: | --- |
| Fidelidade visual e responsividade | 20 | Aderência ao Figma e consistência entre tamanhos de tela |
| Fluxos e experiência de uso | 20 | Compra e conta completas, validações e recuperação de erros |
| Integração e estado | 15 | Router, Query, Axios, contratos e cache coerentes |
| Tempo real | 10 | Eventos, reconexão, ordenação e sincronização com REST |
| Mocking | 10 | MSW, cenários determinísticos, persistência e reset |
| Testes | 10 | Cobertura dos fluxos e falhas com Playwright |
| Acessibilidade | 5 | Operação por teclado, semântica, foco e feedback |
| Performance | 5 | Resultados e análise das auditorias Lighthouse |
| Arquitetura e documentação | 5 | Tipagem, responsabilidades e execução reproduzível |
| **Total** | **100** | |

São eliminatórios: ausência de uso efetivo da stack obrigatória, fluxos principais apenas visuais, compra confirmada sem resposta da simulação, exposição de dados entre usuários, eventos simulados diretamente na UI ou ausência de testes E2E executáveis.

## 12. Entrega

Entregue código-fonte, lockfile, assets, mocks, fixtures, testes e configurações de auditoria.

O **deploy é obrigatório**. Envie o link do repositório e uma URL pública da aplicação. Recomenda-se [Vercel](https://vercel.com/docs/frameworks/frontend/vite); [Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) e [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) também são aceitos.

A versão publicada deve corresponder ao código entregue e permanecer acessível durante a avaliação, com os mocks e os fluxos de tempo real funcionando. Acesso direto e refresh das rotas devem funcionar no ambiente publicado.

O `README.md` da solução deve conter setup, variáveis de ambiente, credenciais fictícias, seleção e reset dos cenários, comandos de execução e instruções para reproduzir os fluxos de falha.

Documente os contratos REST e eventos, a política de sessão, o estado do carrinho, a estratégia de cache e a reconciliação entre REST e Socket.IO. Registre limitações, decisões de UX e eventuais desvios do Figma em `ARCHITECTURE.md`.

Disponibilize comandos para desenvolvimento com mocks, build, preview, verificação de tipos, lint, testes Playwright e auditoria Lighthouse.

A entrega deve executar a partir de um checkout limpo, sem depender de serviços privados ou do backend de produção.
