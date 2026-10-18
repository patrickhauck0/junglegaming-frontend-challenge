import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { TrashIcon, ArrowLeftIcon } from '@/components/ui/icons';
import { Button, Input } from '@/components/ui';
import { addEth, subtractEth, multiplyEthByQuantity, applyDiscountPercent } from '@/utils/eth-math';
import { apiClient } from '@/lib/axios';
import { socketClient } from '@/lib/socket-client';
import type { NftUpdatedEvent } from '@/contracts/socket';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

const RELATED_NFTS = [
  {
    id: 'nft_06',
    title: 'Cosmic Bloom #118',
    priceEth: '1.29',
    imageUrl: '/assets/nfts/emerald-ape.webp',
  },
  {
    id: 'nft_02',
    title: 'Violet Nomad #314',
    priceEth: '1.39',
    imageUrl: '/assets/nfts/sage-nomad.webp',
  },
  {
    id: 'nft_05',
    title: 'Ivory Baron #088',
    priceEth: '1.79',
    imageUrl: '/assets/nfts/ivory-baron.webp',
  },
  {
    id: 'nft_04',
    title: 'Golden Beat #207',
    priceEth: '0.99',
    imageUrl: '/assets/nfts/golden-beat.webp',
  },
  {
    id: 'nft_07',
    title: 'Golden Signal #160',
    priceEth: '0.39',
    imageUrl: '/assets/nfts/golden-beat.webp',
  },
];

const GAS_FEE_ETH = '0.016';

function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('__kurio_applied_coupon__') : null;
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('__kurio_applied_coupon__') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        return { message: `${parsed.percent}% de desconto aplicado com sucesso!`, isError: false };
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [priceNotice, setPriceNotice] = useState<string | null>(null);

  useEffect(() => {
    if (appliedCoupon) {
      sessionStorage.setItem('__kurio_applied_coupon__', JSON.stringify(appliedCoupon));
    } else {
      sessionStorage.removeItem('__kurio_applied_coupon__');
    }
  }, [appliedCoupon]);

  const items = useMemo(() => cart?.items || [], [cart?.items]);

  // Escuta WebSocket em tempo real para alteração de cotação dos NFTs no carrinho
  useEffect(() => {
    const socket = socketClient.getSocket() || socketClient.connect();
    const handleNftUpdated = (evt: NftUpdatedEvent) => {
      const affected = items.find((i) => i.nftId === evt.resourceId || i.nftId === evt.payload?.id);
      if (affected) {
        setPriceNotice(
          `O item "${affected.nft?.title || affected.nftId}" teve o preço atualizado na rede. Atualizando carrinho...`
        );
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    };

    socket.on('nft.updated', handleNftUpdated);
    return () => {
      socket.off('nft.updated', handleNftUpdated);
    };
  }, [items, queryClient]);

  const subtotalEth = items.reduce((acc, item) => {
    const itemTotal = multiplyEthByQuantity(item.priceEth, item.quantity);
    return addEth(acc, itemTotal);
  }, '0.00');

  let discountEth = '0.00';
  if (appliedCoupon && appliedCoupon.percent > 0) {
    const discountResult = applyDiscountPercent(subtotalEth, appliedCoupon.percent);
    discountEth = discountResult.discountEth;
  }

  const subtotalAfterDiscount = subtractEth(subtotalEth, discountEth);
  const totalEth = items.length > 0 ? addEth(subtotalAfterDiscount, GAS_FEE_ETH) : '0.00';

  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setCouponFeedback({ message: 'Digite um código de cupom.', isError: true });
      return;
    }

    setIsApplyingCoupon(true);
    setCouponFeedback(null);
    try {
      const res = await apiClient.post('/api/cart/coupon', { code: clean });
      const data = res.data;
      const discountPercent = data.coupon?.discountPercent ?? data.discountPercent ?? 10;
      setAppliedCoupon({ code: clean, percent: discountPercent });
      setCouponFeedback({
        message: `${discountPercent}% de desconto aplicado com sucesso!`,
        isError: false,
      });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setAppliedCoupon(null);
      setCouponFeedback({
        message: errObj.response?.data?.message || 'Código promocional inválido ou expirado.',
        isError: true,
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleUpdateQuantity = (nftId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeMutation.mutate(nftId);
    } else {
      updateMutation.mutate({ nftId, quantity: newQty });
    }
  };

  const handleRemoveItem = (nftId: string) => {
    removeMutation.mutate(nftId);
  };

  const handleCheckout = () => {
    navigate({ to: '/payment' });
  };

  return (
    <div className="min-h-screen bg-ink text-foreground">
      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (1440px / md+)                              */}
      {/* ========================================================= */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] pt-6 pb-24 font-mono">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-7">
          <p className="font-mono font-bold text-[15px] leading-[16px] text-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Início
            </Link>{' '}
            /{' '}
            <Link to="/" className="hover:text-primary transition-colors">
              Mercado
            </Link>{' '}
            / <span className="text-foreground">Carrinho</span>
          </p>
        </nav>

        {/* Alerta de alteração de preço em tempo real */}
        {priceNotice && (
          <div className="p-3.5 bg-amber-950/60 border border-amber-500/70 rounded-[4px] text-amber-200 text-[13px] flex items-center justify-between gap-3 mb-6">
            <p className="flex items-center gap-2">
              <span>⚡</span>
              <span>{priceNotice}</span>
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPriceNotice(null)}
              className="text-amber-300 hover:text-amber-100 text-[12px] h-7 px-2"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Cart Body: Cart Table (782px) + Wallet Summary (332px) */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-[86px] w-full">
          {/* Cart Table Container */}
          <div className="flex-1 w-full max-w-[782px]">
            {/* Table Header */}
            <div className="flex items-center justify-between pr-6 w-full text-foreground">
              <div className="w-[250px]">
                <p className="font-mono font-bold text-[16px] leading-[16px]">NFTs</p>
              </div>
              <div className="w-[77px] text-center">
                <p className="font-mono font-medium text-[16px] leading-[16px]">Preço</p>
              </div>
              <div className="w-[75px] text-center">
                <p className="font-mono font-bold text-[16px] leading-[16px]">Edições</p>
              </div>
              <div className="w-[87px] text-right">
                <p className="font-mono font-medium text-[16px] leading-[16px]">Total</p>
              </div>
              <div className="w-6" aria-hidden="true" />
            </div>

            {/* Hairline Divider */}
            <div className="w-full h-px bg-primary/30 my-3" />

            {/* Cart Items List */}
            {isLoading ? (
              <div className="flex flex-col gap-3 w-full" role="status" aria-label="Carregando itens do carrinho">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-surface-card h-[70px] rounded-[6px] pr-6 pl-2 flex items-center justify-between w-full animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-[62px] rounded-[6px] bg-[#3F2319]" />
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-[#3F2319] rounded" />
                        <div className="h-3 w-20 bg-[#3F2319]/70 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-[#3F2319] rounded" />
                    <div className="h-6 w-16 bg-[#3F2319] rounded-full" />
                    <div className="h-4 w-20 bg-[#3F2319] rounded" />
                    <div className="size-5 bg-[#3F2319] rounded" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-surface-card rounded-[6px] p-8 text-center my-4">
                <p className="text-[16px] text-foreground font-bold mb-2">Seu carrinho está vazio</p>
                <p className="text-[14px] text-text-secondary mb-6">
                  Explore as coleções exclusivas de artes digitais e encontre seu próximo NFT.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-[3px] bg-primary text-ink font-bold text-[15px] hover:bg-[#E89B55] transition-colors"
                >
                  Explorar Mercado
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {items.map((item) => {
                  const itemTotalEth = multiplyEthByQuantity(item.priceEth, item.quantity);
                  const tokenId = item.nft?.edition ? `#${item.nft.edition.replace('/', '')}` : `#00${item.nftId.replace(/\D/g, '') || '42'}`;

                  return (
                    <div
                      key={item.nftId}
                      className="bg-surface-card h-[70px] rounded-[6px] pr-6 flex items-center justify-between w-full"
                    >
                      {/* NFT Info */}
                      <div className="w-[250px] flex items-center gap-4">
                        <img
                          src={item.nft?.imageUrl || '/assets/nfts/emerald-ape.webp'}
                          alt={item.nft?.title || 'NFT'}
                          className="size-[70px] rounded-[6px] object-cover shrink-0"
                        />
                        <div className="flex flex-col gap-[6px] truncate">
                          <Link
                            to="/nfts/$id"
                            params={{ id: item.nftId }}
                            className="font-mono font-bold text-[16px] text-foreground leading-[16px] hover:text-primary transition-colors truncate"
                          >
                            {item.nft?.title || item.nftId}
                          </Link>
                          <p className="font-mono font-normal text-[14px] text-secondary leading-[16px]">
                            ID do token: {tokenId}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="w-[77px] text-center">
                        <p className="font-mono font-bold text-[16px] text-text-secondary leading-[16px] whitespace-nowrap">
                          {item.priceEth} ETH
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="w-[75px] flex items-center justify-center gap-3">
                        <Button
                          type="button"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.nftId, item.quantity, -1)}
                          disabled={updateMutation.isPending || removeMutation.isPending}
                          className="h-[30px] w-5 bg-primary border border-ink rounded-[20px] flex items-center justify-center shadow-[0px_4px_6px_rgba(20,13,10,0.15)] hover:bg-[#E89B55] transition-colors cursor-pointer disabled:opacity-50 p-0"
                          aria-label={`Diminuir quantidade de ${item.nft?.title}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3.33333 8.66667V7.33333H12.6667V8.66667H3.33333Z" fill="black" />
                          </svg>
                        </Button>
                        <span className="font-mono font-normal text-[17px] text-foreground leading-[24px] min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.nftId, item.quantity, 1)}
                          disabled={updateMutation.isPending || removeMutation.isPending}
                          className="h-[30px] w-5 bg-primary border border-ink rounded-[20px] flex items-center justify-center shadow-[0px_4px_6px_rgba(20,13,10,0.15)] hover:bg-[#E89B55] transition-colors cursor-pointer disabled:opacity-50 p-0"
                          aria-label={`Aumentar quantidade de ${item.nft?.title}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.33333 8.66667H3.33333V7.33333H7.33333V3.33333H8.66667V7.33333H12.6667V8.66667H8.66667V12.6667H7.33333V8.66667Z" fill="black" />
                          </svg>
                        </Button>
                      </div>

                      {/* Total */}
                      <div className="w-[87px] text-right">
                        <p className="font-mono font-bold text-[16px] text-text-accent leading-[16px] whitespace-nowrap">
                          {itemTotalEth} ETH
                        </p>
                      </div>

                      {/* Delete */}
                      <div className="w-6 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.nftId)}
                          disabled={removeMutation.isPending}
                          className="text-secondary hover:text-text-accent transition-colors cursor-pointer disabled:opacity-50 p-0 h-auto hover:bg-transparent"
                          aria-label={`Remover ${item.nft?.title} do carrinho`}
                        >
                          <TrashIcon className="size-6 text-secondary hover:text-text-accent" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Wallet Summary Panel */}
          <div className="w-full lg:w-[332px] shrink-0 flex flex-col gap-6">
            {/* Heading */}
            <div className="flex flex-col gap-3 w-full">
              <h2 className="font-mono font-bold text-[18px] text-foreground leading-[16px]">
                Resumo da carteira
              </h2>
              <div className="w-full h-px bg-primary/30" />
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2 w-full">
              <label htmlFor="desktop-promo-input" className="font-mono font-bold text-[14px] text-foreground leading-[16px]">
                Código promocional
              </label>
              <div className="border border-primary rounded-[3px] flex h-10 items-center pl-2 w-full">
                <Input
                  id="desktop-promo-input"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Digite o código promocional..."
                  className="bg-transparent flex-1 text-[12px] font-mono text-foreground placeholder:text-secondary border-none outline-none focus:ring-0 shadow-none h-9 px-1"
                />
                <Button
                  type="submit"
                  disabled={isApplyingCoupon}
                  className="bg-primary h-10 w-[102px] rounded-r-[2px] rounded-l-none flex items-center justify-center font-mono font-bold text-[15px] text-ink hover:bg-[#E89B55] transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {isApplyingCoupon ? '...' : 'Aplicar'}
                </Button>
              </div>
              {couponFeedback && (
                <p className={`text-[12px] font-mono ${couponFeedback.isError ? 'text-red-400' : 'text-green-400'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </form>

            {/* Fees */}
            <div className="flex flex-col gap-3 w-full font-mono text-foreground text-[15px]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-[18px] text-foreground font-normal">{subtotalEth} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Desconto do lançamento</span>
                <span>{appliedCoupon ? `(-) ${discountEth} ETH` : '(-) 00.00'}</span>
              </div>
              <div className="flex flex-col gap-1 items-end w-full">
                <div className="flex items-center justify-between w-full">
                  <span>Taxa de rede</span>
                  <span className="text-[18px] text-foreground font-normal">{items.length > 0 ? `${GAS_FEE_ETH} ETH` : '0.00 ETH'}</span>
                </div>
                <span className="text-[12px] text-text-accent">Taxa estimada</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between font-mono font-bold w-full leading-[16px]">
              <span className="text-[16px] text-foreground">Total</span>
              <span className="text-[18px] text-text-accent">{totalEth} ETH</span>
            </div>

            {/* Checkout CTA */}
            <div className="flex flex-col gap-3 items-center w-full">
              <Button
                type="button"
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="bg-primary h-10 w-full rounded-[3px] flex items-center justify-center font-mono font-bold text-[15px] text-ink hover:bg-[#E89B55] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Conectar e finalizar
              </Button>
              <Link
                to="/"
                className="font-mono text-[15px] text-text-accent text-center hover:underline cursor-pointer"
              >
                Continuar explorando
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section aria-labelledby="related-heading" className="mt-24">
          <div className="flex flex-col gap-3 w-full mb-8">
            <h2 id="related-heading" className="font-mono font-bold text-[17px] text-text-accent leading-[16px]">
              Colecionadores também viram
            </h2>
            <div className="w-full h-px bg-primary/30" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {RELATED_NFTS.map((nft) => (
              <Link
                key={nft.id}
                to="/nfts/$id"
                params={{ id: nft.id }}
                className="flex flex-col gap-2 group cursor-pointer"
              >
                <div className="bg-surface-card h-[255px] w-full flex items-center justify-center rounded-[8px] overflow-hidden group-hover:border group-hover:border-primary/50 transition-all">
                  <img
                    src={nft.imageUrl}
                    alt={nft.title}
                    className="size-[212px] object-cover rounded-[17px] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-[15px] text-foreground group-hover:text-primary transition-colors truncate">
                    {nft.title}
                  </p>
                  <p className="font-mono font-bold text-[16px] text-text-accent">
                    {nft.priceEth} ETH
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
            <div className="size-3 rounded-full border border-primary" />
            <div className="size-3 rounded-full bg-primary" />
            <div className="size-3 rounded-full border border-primary" />
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* MOBILE LAYOUT (390px / md:hidden)                          */}
      {/* ========================================================= */}
      <div className="md:hidden min-h-screen bg-ink flex flex-col justify-between pt-6 font-mono">
        {/* Mobile Header: Back button + Title */}
        <div className="px-4 relative h-11 flex items-center mb-4">
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="size-[35px] rounded-full bg-surface-raised border border-border flex items-center justify-center text-secondary hover:text-foreground transition-colors cursor-pointer z-10"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          <h1 className="font-mono font-bold text-[20px] text-foreground absolute left-1/2 -translate-x-1/2 whitespace-nowrap leading-[16px]">
            Carrinho de NFTs
          </h1>
        </div>

        {/* Mobile Cart Items */}
        <div className="px-4 flex flex-col gap-5 flex-1 pb-6 items-center">
          {isLoading ? (
            <div className="w-full max-w-[358px] flex flex-col gap-4 animate-pulse" role="status" aria-label="Carregando itens do carrinho">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-[100px] w-full bg-surface-card rounded-[14px] flex items-center shrink-0 pr-4 overflow-hidden"
                >
                  <div className="size-[100px] bg-[#3F2319] shrink-0" />
                  <div className="pl-3 py-3 flex flex-col justify-between h-full flex-1">
                    <div className="h-4 w-32 bg-[#3F2319] rounded" />
                    <div className="h-3 w-20 bg-[#3F2319]/70 rounded" />
                    <div className="h-4 w-24 bg-[#3F2319] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="w-full max-w-[358px] bg-surface-card rounded-[14px] p-6 text-center my-6">
              <p className="text-[16px] text-foreground font-bold mb-2">Seu carrinho está vazio</p>
              <p className="text-[13px] text-text-secondary mb-4">
                Adicione itens para visualizar o resumo.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center h-10 px-5 rounded-[20px] bg-primary text-ink font-bold text-[14px]"
              >
                Explorar Mercado
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.nftId}
                className="h-[100px] w-full max-w-[358px] bg-surface-card rounded-[14px] shadow-[0px_6px_20px_0px_rgba(10,6,4,0.45)] flex items-center justify-between relative overflow-hidden shrink-0 pr-4"
              >
                <div className="flex items-center h-full min-w-0">
                  <img
                    src={item.nft?.imageUrl || '/assets/nfts/emerald-ape.webp'}
                    alt={item.nft?.title || 'NFT'}
                    className="size-[100px] rounded-l-[14px] object-cover shrink-0"
                  />

                  <div className="pl-3 py-2.5 flex flex-col justify-between h-full min-w-0">
                    <p className="font-mono font-bold text-[14px] sm:text-[15px] text-foreground leading-[16px] whitespace-nowrap">
                      {item.nft?.title || item.nftId}
                    </p>
                    <p className="font-mono font-normal text-[14px] text-text-secondary leading-[16px]">
                      Edição: {item.nft?.edition || '1/50'}
                    </p>
                    <p className="font-mono font-bold text-[18px] text-text-accent leading-[16px]">
                      {item.priceEth} ETH
                    </p>
                  </div>
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.nftId, item.quantity, -1)}
                    disabled={updateMutation.isPending || removeMutation.isPending}
                    className="size-6 rounded-full bg-surface-raised border border-border flex items-center justify-center cursor-pointer disabled:opacity-50 p-0 hover:bg-surface-raised/80"
                    aria-label={`Diminuir quantidade de ${item.nft?.title}`}
                  >
                    <span className={`block w-2.5 h-0.5 ${item.quantity > 1 ? 'bg-foreground' : 'bg-[#55321F]'}`} />
                  </Button>

                  <span className="font-mono text-[16px] text-foreground min-w-[14px] text-center">
                    {item.quantity}
                  </span>

                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.nftId, item.quantity, 1)}
                    disabled={updateMutation.isPending || removeMutation.isPending}
                    className="size-6 rounded-full bg-surface-raised border border-border flex items-center justify-center font-mono text-[21px] text-foreground leading-none cursor-pointer disabled:opacity-50 p-0 hover:bg-surface-raised/80"
                    aria-label={`Aumentar quantidade de ${item.nft?.title}`}
                  >
                    +
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.nftId)}
                    disabled={removeMutation.isPending}
                    className="size-6 flex items-center justify-center text-secondary hover:text-text-accent cursor-pointer ml-1 p-0 hover:bg-transparent"
                    aria-label={`Remover ${item.nft?.title}`}
                  >
                    <TrashIcon className="size-5 text-secondary" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Payment Summary Drawer */}
        <div className="bg-surface-card rounded-t-[40px] px-6 pt-6 pb-10 flex flex-col gap-5 w-full mt-auto">
          {/* Promo Input */}
          <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2 w-full">
            <div className="bg-surface-card border border-border rounded-[40px] drop-shadow-[0px_6px_10px_rgba(10,6,4,0.45)] flex h-[50px] items-center pl-4 pr-1 w-full overflow-hidden">
              <Input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Digite o código promocional..."
                className="bg-transparent flex-1 font-mono font-normal text-[13px] text-foreground placeholder:text-secondary border-none outline-none focus:ring-0 shadow-none h-9 px-1"
              />
              <Button
                type="submit"
                disabled={isApplyingCoupon}
                className="h-[42px] w-[97px] rounded-[40px] flex items-center justify-center font-mono font-bold text-[15px] text-foreground bg-gradient-to-r from-primary/50 to-primary cursor-pointer shrink-0 disabled:opacity-60"
              >
                {isApplyingCoupon ? '...' : 'Aplicar'}
              </Button>
            </div>
            {couponFeedback && (
              <p className={`text-[12px] font-mono px-2 ${couponFeedback.isError ? 'text-red-400' : 'text-green-400'}`}>
                {couponFeedback.message}
              </p>
            )}
          </form>

          {/* Breakdown */}
          <div className="flex flex-col gap-3 font-mono font-normal text-foreground text-[15px]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-[16px]">{subtotalEth} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Desconto do lançamento</span>
              <span>{appliedCoupon ? `(-) ${discountEth} ETH` : '(-) 00.00'}</span>
            </div>
            <div className="flex flex-col gap-1 items-end w-full">
              <div className="flex items-center justify-between w-full">
                <span>Taxa de rede</span>
                <span className="text-[16px]">{items.length > 0 ? `${GAS_FEE_ETH} ETH` : '0.00 ETH'}</span>
              </div>
              <span className="text-[12px] text-text-accent">Taxa estimada</span>
            </div>
            <div className="flex items-center justify-between font-bold text-[16px] pt-1">
              <span>Total</span>
              <span className="text-[18px] text-text-accent">{totalEth} ETH</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="h-[60px] w-full rounded-[40px] flex items-center justify-center font-mono font-bold text-[16px] text-ink bg-gradient-to-r from-primary to-primary/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
          >
            Conectar e finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}
