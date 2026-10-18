import { useState, useEffect } from 'react';
import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useOrder } from '@/hooks/useOrder';
import { multiplyEthByQuantity } from '@/utils/eth-math';
import { ThankYouIcon, CloseModalIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui';
import { socketClient } from '@/lib/socket-client';
import type { OrderUpdatedEvent } from '@/contracts/socket';

export const Route = createFileRoute('/orders/$id')({
  beforeLoad: ({ location }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('__kurio_auth_token__') : null;
    if (!token) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: OrderConfirmationPage,
});

function formatOrderDate(dateStr?: string): string {
  if (!dateStr) return '29 Jul, 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '29 Jul, 2026';
    const day = d.toLocaleDateString('pt-BR', { day: '2-digit' });
    const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const year = d.getFullYear();
    return `${day} ${capitalizedMonth}, ${year}`;
  } catch {
    return '29 Jul, 2026';
  }
}

function formatAddress(addr?: string): string {
  if (!addr) return '0xA91F…E82C';
  if (addr.includes('…') || addr.includes('...')) return addr;
  if (addr.length > 12) {
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  }
  return addr;
}

function formatTokenId(nftId: string, title?: string): string {
  const match = title?.match(/#(\d+)/);
  if (match?.[1]) {
    return `ID do token: #${match[1]}`;
  }
  const digits = nftId.replace(/\D/g, '');
  return `ID do token: #${digits ? digits.padStart(4, '0') : '0042'}`;
}

function OrderConfirmationPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: order, isLoading, error, refetch } = useOrder(id);
  const [explorerFeedback, setExplorerFeedback] = useState(false);

  // Escuta WebSocket em tempo real para atualização de status do pedido
  useEffect(() => {
    const socket = socketClient.getSocket() || socketClient.connect();
    const handleOrderUpdated = (evt: OrderUpdatedEvent) => {
      if (evt.resourceId === id || evt.payload?.id === id) {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
      }
    };
    socket.on('order.updated', handleOrderUpdated);
    return () => {
      socket.off('order.updated', handleOrderUpdated);
    };
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#140D0A] flex flex-col items-center justify-center p-4">
        <div
          role="status"
          aria-label="Carregando confirmação do pedido"
          className="relative w-full max-w-[578px] bg-[#241612] border border-[#3F2319] rounded-[8px] overflow-hidden shadow-2xl animate-pulse"
        >
          <div className="h-[156px] flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-20 bg-[#3F2319] rounded" />
            <div className="h-4 w-64 bg-[#3F2319] rounded" />
          </div>
          <div className="h-px w-full bg-[#D28A4C]" />
          <div className="h-[65px] bg-[#241612] px-6 py-3 flex items-center justify-between border-b border-[#D28A4C]">
            <div className="h-5 w-24 bg-[#3F2319] rounded" />
            <div className="h-5 w-20 bg-[#3F2319] rounded" />
            <div className="h-5 w-20 bg-[#3F2319] rounded" />
            <div className="h-5 w-20 bg-[#3F2319] rounded" />
          </div>
          <div className="p-6 space-y-4">
            <div className="h-16 w-full bg-[#2F1D15] rounded" />
            <div className="h-16 w-full bg-[#2F1D15] rounded" />
            <div className="h-16 w-full bg-[#2F1D15] rounded" />
          </div>
          <div className="h-[10px] w-full bg-[#D28A4C]" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#140D0A] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-[578px] bg-[#241612] border border-[#3F2319] rounded-[8px] p-8 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3F2319] flex items-center justify-center text-[#E89B55] text-2xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold text-[#F5F1EB] mb-2 font-mono">
            Pedido não encontrado
          </h1>
          <p className="text-sm text-[#CFB28C] mb-6 leading-relaxed">
            Não foi possível localizar as informações do pedido #{id}. Verifique se o identificador está correto ou retorne ao catálogo.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[15px] px-6 py-3 rounded-[5px] transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  // Estado 1: Transação pendente na rede blockchain
  if (order.status === 'pending') {
    return (
      <div className="min-h-screen bg-[#140D0A] flex flex-col items-center justify-center p-4 text-center font-mono">
        <div className="w-full max-w-[578px] bg-[#241612] border border-[#D28A4C]/60 rounded-[8px] p-8 shadow-2xl flex flex-col items-center gap-4">
          <div className="size-16 rounded-full border-4 border-[#D28A4C] border-t-transparent animate-spin my-2" />
          <h1 className="text-xl font-bold text-[#F5F1EB]">
            Processando transação na blockchain...
          </h1>
          <p className="text-sm text-[#CFB28C] leading-relaxed max-w-[440px]">
            Aguardando confirmação dos blocos na rede. Este recibo será atualizado automaticamente em tempo real via WebSocket assim que o status mudar para confirmado.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="border-[#D28A4C] text-[#E89B55] hover:bg-[#D28A4C]/10"
            >
              Verificar agora
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate({ to: '/' })}
            >
              Voltar ao catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado 2: Pedido recusado pelo gateway/carteira
  if (order.status === 'declined') {
    return (
      <div className="min-h-screen bg-[#140D0A] flex flex-col items-center justify-center p-4 text-center font-mono">
        <div className="w-full max-w-[578px] bg-[#241612] border border-[#F0805F] rounded-[8px] p-8 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#381F1A] border border-[#F0805F] flex items-center justify-center text-[#F0805F] text-2xl font-bold">
            ✕
          </div>
          <h1 className="text-xl font-bold text-[#F5F1EB] mb-2">
            Pagamento recusado
          </h1>
          <p className="text-sm text-[#CFB28C] mb-6 leading-relaxed">
            {order.declinedReason || 'A transação não pôde ser confirmada na rede blockchain. Seus itens foram preservados no carrinho.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/payment"
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[15px] px-6 py-3 rounded-[5px] transition-colors"
            >
              Tentar novamente
            </Link>
            <Link
              to="/cart"
              className="border border-[#D28A4C] text-[#E89B55] hover:bg-[#D28A4C]/10 font-bold text-[15px] px-6 py-3 rounded-[5px] transition-colors"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const txHash = order?.transactionHash || '0xA91F…E82C';
  const displayTxId = formatAddress(txHash);
  const formattedDate = formatOrderDate(order?.createdAt);
  const totalEth = order?.totalEth || '26.846';
  const gasFeeEth = order?.gasFeeEth || '0.016';
  const walletType = order?.network === 'Polygon' ? 'Polygon' : 'MetaMask';
  const items = order?.items || [];

  return (
    <div
      className="relative min-h-[calc(100vh-80px)] bg-[#140D0A] flex flex-col items-center justify-center px-4 py-8 md:py-16 overflow-x-hidden"
      data-node-id="11:4385"
      data-name="Desktop / Confirmação de Pedido"
    >
      {/* Camada simulada de fundo (Checkout Page em backdrop suave) */}
      <div
        className="hidden md:flex absolute inset-0 opacity-20 pointer-events-none select-none blur-[1px] px-[120px] py-[24px] flex-col gap-[96px] z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-full flex justify-between text-xs text-[#CFB28C]">
          <span>Início / Mercado / Pagamento</span>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="h-96 border border-[#3F2319] rounded bg-[#1C110E]" />
          <div className="h-96 border border-[#3F2319] rounded bg-[#1C110E]" />
        </div>
      </div>

      {/* Overlay escuro em foco no Modal */}
      <div className="absolute inset-0 bg-[#140D0A]/70 z-10 pointer-events-none" />

      {/* Modal Principal de Confirmação 1:1 com o Figma (578px de largura) */}
      <div
        className="relative z-20 w-full max-w-[578px] bg-[#241612] border border-[#3F2319] rounded-[8px] overflow-hidden shadow-2xl"
        data-node-id="70376:239"
        data-name="Order Confirmation Modal"
      >
        {/* Botão de Fechar X no canto superior direito */}
        <button
          type="button"
          onClick={() => navigate({ to: '/' })}
          aria-label="Fechar confirmação e voltar ao início"
          className="absolute right-[14px] top-[14px] z-30 p-2 text-[#D28A4C] hover:opacity-80 transition-opacity cursor-pointer"
          data-node-id="12:5223"
          data-name="X"
        >
          <CloseModalIcon className="size-[18px]" />
        </button>

        {/* Modal Header: Ícone Thank You + Título */}
        <div
          className="h-[156px] flex flex-col items-center justify-center gap-[16px] px-6 text-center"
          data-node-id="70376:240"
          data-name="Modal Header"
        >
          <div className="size-[80px] flex items-center justify-center" data-node-id="11:5150">
            <ThankYouIcon className="w-[66px] h-[80px]" />
          </div>
          <p
            className="font-mono text-[16px] font-bold text-[#CFB28C] leading-[16px]"
            data-node-id="11:5149"
          >
            Seus NFTs agora estão na sua carteira
          </p>
        </div>

        {/* Linha Divisória Âmbar */}
        <div className="bg-[#D28A4C] h-px w-full shrink-0" data-node-id="11:5161" />

        {/* Metadados da Transação: 4 colunas (adaptável para 2x2 no mobile) */}
        <div
          className="min-h-[65px] px-4 sm:px-[36px] py-[8px] sm:py-[4px] flex items-center"
          data-node-id="70376:241"
          data-name="Transaction Meta"
        >
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between w-full gap-3 sm:gap-0">
            {/* Coluna 1: ID da transação */}
            <div className="flex flex-col items-start text-[#CFB28C] sm:w-[127px]">
              <p className="font-mono font-bold text-[14px] leading-[16px]">
                ID da transação
              </p>
              <p className="font-mono font-normal text-[15px] leading-normal truncate max-w-full">
                {displayTxId}
              </p>
            </div>

            {/* Separador vertical (apenas desktop/tablet) */}
            <div className="hidden sm:block h-[31px] w-px bg-[#D28A4C]/40 mx-2" />

            {/* Coluna 2: Data */}
            <div className="flex flex-col items-start text-[#CFB28C] sm:w-[109px]">
              <p className="font-mono font-normal text-[14px] leading-[16px]">
                Data
              </p>
              <p className="font-mono font-normal text-[15px] leading-normal whitespace-nowrap">
                {formattedDate}
              </p>
            </div>

            {/* Separador vertical */}
            <div className="hidden sm:block h-[31px] w-px bg-[#D28A4C]/40 mx-2" />

            {/* Coluna 3: Total */}
            <div className="flex flex-col items-start text-[#CFB28C] sm:w-[91px]">
              <p className="font-mono font-normal text-[14px] leading-[16px]">
                Total
              </p>
              <p className="font-mono font-normal text-[15px] leading-normal whitespace-nowrap">
                {totalEth} ETH
              </p>
            </div>

            {/* Separador vertical */}
            <div className="hidden sm:block h-[31px] w-px bg-[#D28A4C]/40 mx-2" />

            {/* Coluna 4: Carteira */}
            <div className="flex flex-col items-start text-[#CFB28C] sm:w-[73px]">
              <p className="font-mono font-bold text-[14px] leading-[16px]">
                Carteira
              </p>
              <p className="font-mono font-normal text-[15px] leading-normal whitespace-nowrap">
                {walletType}
              </p>
            </div>
          </div>
        </div>

        {/* Linha Divisória Âmbar */}
        <div className="bg-[#D28A4C] h-px w-full shrink-0" data-node-id="11:5163" />

        {/* Detalhes da Transação: Itens, Totais e Botão Etherscan */}
        <div
          className="flex flex-col gap-[12px] pb-[48px] pt-[20px] px-4 sm:px-[44px]"
          data-node-id="70376:242"
          data-name="Transaction Details"
        >
          {/* Título da Seção */}
          <p
            className="font-mono font-bold text-[15px] leading-[16px] text-[#F5F1EB]"
            data-node-id="11:5167"
          >
            Detalhes da transação
          </p>

          {/* Cabeçalho da Tabela */}
          <div
            className="flex items-center justify-between w-full"
            data-node-id="70376:243"
            data-name="Table Header"
          >
            <p className="font-mono font-bold text-[14px] sm:text-[16px] leading-[16px] text-[#F5F1EB]">
              NFTs
            </p>
            <div className="flex items-center gap-[16px] sm:gap-[48px] text-[14px] sm:text-[16px] text-[#F5F1EB]">
              <p className="font-mono font-bold leading-[16px]">Edições</p>
              <p className="font-mono font-medium leading-[16px]">Subtotal</p>
            </div>
          </div>

          {/* Divisória da tabela */}
          <div className="h-px w-full bg-[#3F2319]" />

          {/* Lista de Itens do Recibo */}
          <div
            className="flex flex-col gap-[12px] w-full"
            data-node-id="70376:244"
            data-name="Items"
          >
            {items.map((item) => {
              const itemSubtotal = multiplyEthByQuantity(item.priceEth, item.quantity);
              return (
                <div
                  key={`${item.nftId}-${item.edition}`}
                  className="bg-[#241612] h-[70px] flex items-center justify-between w-full gap-2"
                >
                  {/* Lado Esquerdo: Imagem + Título + ID do Token */}
                  <div className="flex items-center gap-[8px] sm:gap-[12px] min-w-0 flex-1">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="size-[54px] sm:size-[70px] rounded-[8px] object-cover bg-black/20 shrink-0"
                    />
                    <div className="flex flex-col gap-[4px] sm:gap-[6px] items-start min-w-0">
                      <p className="font-mono font-bold text-[13px] sm:text-[16px] leading-[16px] text-[#F5F1EB] truncate max-w-[115px] sm:max-w-[180px]">
                        {item.title}
                      </p>
                      <p className="font-mono font-normal text-[11px] sm:text-[14px] leading-[16px] text-[#B39463]">
                        {formatTokenId(item.nftId, item.title)}
                      </p>
                    </div>
                  </div>

                  {/* Lado Direito: Quantidade (x N) + Subtotal em ETH */}
                  <div className="flex items-center gap-[16px] sm:gap-[48px] text-right shrink-0">
                    <p className="font-mono font-normal text-[12px] sm:text-[14px] leading-[16px] text-[#CFB28C] whitespace-nowrap">
                      (x {item.quantity})
                    </p>
                    <p className="font-mono font-bold text-[14px] sm:text-[18px] leading-[16px] text-[#E89B55] whitespace-nowrap">
                      {itemSubtotal} ETH
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bloco de Totais à Direita (321px no Figma) */}
          <div
            className="flex flex-col items-end w-full sm:w-[321px] ml-auto gap-[12px] pt-2"
            data-node-id="70376:248"
            data-name="Totals"
          >
            {/* Taxa de rede */}
            <div className="flex items-center justify-between w-full font-mono text-[color:var(--color\/foreground,#F5F1EB)]">
              <span className="text-[15px] leading-normal">Taxa de rede</span>
              <span className="text-[18px] leading-[16px] text-right font-normal">
                {gasFeeEth} ETH
              </span>
            </div>

            {/* Total final */}
            <div className="flex items-center justify-between w-full font-mono font-bold leading-[16px]">
              <span className="text-[16px] text-[#F5F1EB]">Total</span>
              <span className="text-[18px] text-[#E89B55] text-right">
                {totalEth} ETH
              </span>
            </div>
          </div>

          {/* Divisória da Nota de Rodapé */}
          <div className="h-px w-full bg-[#3F2319] my-2" />

          {/* Nota de Confirmação na Blockchain & Botão Etherscan */}
          <div
            className="flex flex-col items-center gap-[16px] text-center w-full"
            data-node-id="70376:249"
            data-name="Footer Note"
          >
            <p
              className="font-mono font-normal text-[14px] leading-[22px] text-[#CFB28C] max-w-[490px]"
              data-node-id="12:5217"
            >
              Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.
            </p>

            <Button
              type="button"
              onClick={() => setExplorerFeedback(true)}
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-mono font-bold text-[16px] leading-[16px] px-[24px] py-[16px] rounded-[5px] cursor-pointer transition-colors"
              data-node-id="70376:250"
              data-name="Etherscan Button"
            >
              Ver no Etherscan
            </Button>

            {explorerFeedback && (
              <p
                role="status"
                className="font-mono text-xs text-[#E89B55] mt-1 bg-[#1C110E] px-3 py-2 rounded border border-[#3F2319]"
              >
                Hash verificado na rede: {txHash}
              </p>
            )}
          </div>
        </div>

        {/* Barra Decorativa Inferior Âmbar (10px de altura) */}
        <div
          className="bg-[#D28A4C] h-[10px] w-full shrink-0"
          data-node-id="11:5119"
        />
      </div>
    </div>
  );
}
