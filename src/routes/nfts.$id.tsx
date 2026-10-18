import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useNft, useNfts, useToggleFavorite } from '@/hooks/useNfts';
import { useAddToCart } from '@/hooks/useCart';
import { ShimmerSkeleton } from '@/components/skeletons/ShimmerSkeleton';
import { formatEthValue } from '@/utils/formatters';
import { multiplyEthByQuantity } from '@/utils/eth-math';
import {
  StarIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ZoomIcon,
  ShareLinkedinIcon,
  ShareTwitterIcon,
  ShareMailIcon,
  CartIcon,
} from '@/components/ui/icons';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const Route = createFileRoute('/nfts/$id')({
  component: NftDetailsPage,
});

const EDITIONS = [
  { id: '1/1', label: '1/1', maxAvailable: 1 },
  { id: '1/10', label: '1/10', maxAvailable: 10 },
  { id: '1/50', label: '1/50', maxAvailable: 50 },
  { id: 'open', label: 'ABERTA', maxAvailable: 999 },
];

function NftDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  // Estados locais
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState('1/50');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [buyFeedback, setBuyFeedback] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Consultas
  const { data: nft, isLoading, isError } = useNft(id);
  const { data: relatedData } = useNfts({
    limit: 5,
    tab: 'all',
    sortBy: 'recent',
    page: 1,
  });
  const toggleFavorite = useToggleFavorite();
  const addToCart = useAddToCart();

  // Miniaturas da galeria (com fallback para variações de exibição)
  const galleryImages = [
    nft?.imageUrl || '/assets/nfts/emerald-ape.webp',
    '/assets/nfts/golden-beat.webp',
    '/assets/nfts/sage-nomad.webp',
    '/assets/nfts/ivory-baron.webp',
  ];

  // Cálculo de limite de estoque baseado na edição e no NFT
  const currentEditionObj = EDITIONS.find((e) => e.id === selectedEdition);
  const maxAvailable = Math.min(
    currentEditionObj?.maxAvailable || 50,
    nft?.availableEditions || 50
  );

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(maxAvailable, prev + 1));
  };

  const handleToggleFavorite = () => {
    if (!nft) return;
    toggleFavorite.mutate({
      nftId: nft.id,
      isFavorited: Boolean(nft.isFavorited),
    });
  };

  const handleAddToCart = () => {
    if (!nft) return;
    addToCart.mutate(
      { nftId: nft.id, quantity },
      {
        onSuccess: () => {
          setBuyFeedback(`Adicionado ${quantity}x ao carrinho com sucesso!`);
          setTimeout(() => setBuyFeedback(null), 3000);
        },
      }
    );
  };

  // 1. Estado de Carregamento (Shimmer Skeleton sem CLS)
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Carregando detalhes do NFT"
        className="w-full flex flex-col items-center bg-ink"
      >
        {/* Skeleton Mobile (390px) */}
        <div className="md:hidden w-full flex flex-col relative pb-[180px]">
          <div className="relative w-full h-[460px] p-4 flex flex-col justify-between bg-surface-card/60">
            <div className="flex items-center justify-between w-full">
              <ShimmerSkeleton className="size-[35px] rounded-full" />
              <ShimmerSkeleton className="size-[35px] rounded-full" />
            </div>
            <div className="relative w-full h-[356px] rounded-[24px] overflow-hidden">
              <ShimmerSkeleton className="w-full h-full rounded-[24px]" />
            </div>
            <div className="flex items-center justify-center gap-1.5 pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <ShimmerSkeleton key={`dot-skel-${i}`} className="w-2 h-1.5 rounded-full" />
              ))}
            </div>
          </div>
          <div className="bg-surface-card rounded-t-[31px] -mt-6 p-6 flex flex-col gap-4 relative z-10 shadow-xl border-t border-border/40">
            <div className="flex items-center justify-between w-full">
              <ShimmerSkeleton className="w-[180px] h-[24px] rounded" />
              <ShimmerSkeleton className="w-[70px] h-[24px] rounded-[32px]" />
            </div>
            <ShimmerSkeleton className="w-full h-[48px] rounded" />
            <ShimmerSkeleton className="w-full h-[60px] rounded-[8px]" />
          </div>
        </div>

        {/* Skeleton Desktop (1440px) */}
        <div className="hidden md:flex flex-col max-w-[1440px] w-full px-6 lg:px-[120px] py-8 gap-[48px]">
          <section className="flex flex-col gap-[32px] w-full">
            <div className="flex items-center gap-2">
              <ShimmerSkeleton className="w-[60px] h-[18px] rounded" />
              <span className="text-secondary">/</span>
              <ShimmerSkeleton className="w-[70px] h-[18px] rounded" />
            </div>

            <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
              {/* Galeria Esquerda */}
              <div className="flex gap-[28px] items-center shrink-0 w-full lg:w-[573px]">
                <div className="flex flex-col gap-[16px] shrink-0 w-[100px]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ShimmerSkeleton key={`thumb-skel-${i}`} className="size-[100px] rounded-[8px]" />
                  ))}
                </div>
                <div className="relative size-[444px] bg-surface-card rounded-[6px] p-[16px] flex items-center justify-center shrink-0">
                  <ShimmerSkeleton className="size-[404px] rounded-[24px]" />
                </div>
              </div>

              {/* Informações Direita */}
              <div className="flex-1 flex flex-col justify-between items-start gap-[24px] min-w-0 w-full self-stretch">
                <div className="flex flex-col gap-[12px] w-full">
                  <ShimmerSkeleton className="w-3/4 h-[32px] rounded" />
                  <div className="flex items-center justify-between w-full">
                    <ShimmerSkeleton className="w-[120px] h-[26px] rounded" />
                    <ShimmerSkeleton className="w-[100px] h-[20px] rounded" />
                  </div>
                </div>
                <ShimmerSkeleton className="w-full h-[60px] rounded" />
                <div className="flex flex-col gap-2 w-full">
                  <ShimmerSkeleton className="w-[60px] h-4 rounded" />
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ShimmerSkeleton key={`ed-skel-${i}`} className="h-[40px] rounded-[6px]" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <ShimmerSkeleton className="w-[140px] h-[36px] rounded-[6px]" />
                  <ShimmerSkeleton className="w-[120px] h-4 rounded" />
                </div>
                <div className="flex gap-3 w-full">
                  <ShimmerSkeleton className="flex-1 h-[44px] rounded-[6px]" />
                  <ShimmerSkeleton className="size-[44px] rounded-[6px]" />
                </div>
              </div>
            </div>

            {/* Abas de Conteúdo Skeleton */}
            <div className="flex flex-col gap-6 w-full pt-8 border-t border-border/30">
              <div className="flex gap-8 border-b border-border/30 pb-3">
                <ShimmerSkeleton className="w-[120px] h-[24px] rounded" />
                <ShimmerSkeleton className="w-[200px] h-[24px] rounded" />
              </div>
              <ShimmerSkeleton className="w-full max-w-[900px] h-[60px] rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ShimmerSkeleton key={`prop-${i}`} className="h-[74px] rounded-[8px]" />
                ))}
              </div>
            </div>

            {/* Colecionadores Também Viram Skeleton */}
            <div className="flex flex-col gap-6 w-full pt-8">
              <ShimmerSkeleton className="w-[250px] h-[24px] rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ShimmerSkeleton key={`rel-${i}`} className="h-[250px] rounded-[14px]" />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // 2. Estado de Erro ou 404 (NFT Inexistente)
  if (isError || !nft) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-16 flex flex-col items-center justify-center text-center">
        <div className="size-[80px] rounded-full bg-surface-card border border-border flex items-center justify-center text-text-accent font-mono font-bold text-3xl mb-4">
          ?
        </div>
        <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mb-3">
          NFT Não Encontrado
        </h1>
        <p className="font-mono text-sm text-text-secondary max-w-md mb-6">
          A obra que você procura não existe ou foi removida do catálogo da Kurio.
        </p>
        <Link
          to="/"
          className="bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-bold text-sm px-6 py-3 rounded-[6px] transition-all"
        >
          Voltar para o Mercado
        </Link>
      </div>
    );
  }

  const totalPrice = multiplyEthByQuantity(nft.priceEth, quantity);

  return (
    <div className="w-full flex flex-col items-center bg-ink">
      {/* Região Acessível aria-live para Atualizações em Tempo Real */}
      <div id="a11y-announcements" className="sr-only" aria-live="polite" />

      {/* ========================================================= */}
      {/* VERSÃO MOBILE (390px - Figma Frame 15:5536)               */}
      {/* ========================================================= */}
      <div className="md:hidden w-full flex flex-col relative pb-[180px]">
        {/* Hero Mobile com Imagem, Botão Voltar e Favoritar */}
        <div
          className="relative w-full h-[460px] p-4 flex flex-col justify-between"
          style={{
            backgroundImage:
              'linear-gradient(137.64deg, rgb(36, 22, 18) 12%, rgb(47, 29, 21) 106.59%)',
          }}
        >
          {/* Top Bar Mobile: Voltar e Favoritar */}
          <div className="flex items-center justify-between w-full z-10">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="size-[35px] rounded-full bg-surface-raised border border-border flex items-center justify-center text-foreground cursor-pointer shadow-md"
              aria-label="Voltar para a lista"
            >
              <ArrowLeftIcon className="size-4" />
            </button>

            <button
              type="button"
              data-testid="detail-favorite-btn"
              onClick={handleToggleFavorite}
              className="size-[35px] rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-accent cursor-pointer shadow-md"
              aria-label={nft.isFavorited ? 'Desfavoritar NFT' : 'Favoritar NFT'}
            >
              <HeartIcon filled={nft.isFavorited} className="size-4" />
            </button>
          </div>

          {/* Imagem do NFT Mobile */}
          <div className="relative w-full h-[356px] rounded-[24px] overflow-hidden shadow-2xl flex items-center justify-center">
            <img
              src={galleryImages[selectedImageIndex]}
              alt={nft.title}
              className="w-full h-full object-cover rounded-[24px]"
              loading="eager"
            />
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-3 right-3 text-text-accent bg-ink/70 p-2 rounded-full backdrop-blur-sm hover:brightness-110 cursor-pointer"
              aria-label="Ampliar imagem do NFT (zoom em alta resolução)"
            >
              <ZoomIcon className="size-[20px]" />
            </button>
          </div>

          {/* Dots de Paginação Mobile */}
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {galleryImages.map((_, i) => (
              <button
                key={`dot-mob-${i}`}
                type="button"
                onClick={() => setSelectedImageIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === selectedImageIndex ? 'w-6 bg-primary' : 'w-2 bg-border-soft'
                }`}
                aria-label={`Visualizar imagem ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Sheet de Detalhes Mobile (Figma Node 70396:242) */}
        <div className="bg-surface-card rounded-t-[31px] -mt-6 p-6 flex flex-col gap-4 relative z-10 shadow-xl border-t border-border/40">
          {/* Título e Chip de Avaliação */}
          <div className="flex items-center justify-between w-full">
            <h1 className="font-mono text-[20px] font-bold leading-[24px] text-foreground">
              {nft.title}
            </h1>

            <div className="border border-primary rounded-[32px] px-2 py-0.5 flex items-center gap-1">
              <StarIcon filled className="size-3.5 text-primary" />
              <span className="font-mono text-[14px] font-medium text-foreground">4.8</span>
              <span className="font-mono text-[14px] text-text-secondary">(19)</span>
            </div>
          </div>

          {/* Descrição */}
          <p className="font-mono text-[14px] font-normal leading-[24px] text-text-secondary">
            {nft.description}
          </p>

          {/* Seletor de Edição */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[15px] font-bold text-foreground">Edição:</span>
            <div className="flex items-center gap-3">
              {EDITIONS.map((ed) => {
                const isSelected = ed.id === selectedEdition;
                return (
                  <button
                    key={`mob-ed-${ed.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedEdition(ed.id);
                      setQuantity(1);
                    }}
                    className={`h-[28px] px-3 rounded-full font-mono text-[14px] transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-primary bg-primary/10 text-text-accent font-medium'
                        : 'border border-border bg-transparent text-text-secondary font-normal'
                    }`}
                  >
                    {ed.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metadados do Token */}
          <div className="flex flex-col gap-2 font-mono text-[15px] text-secondary pt-2">
            <p>ID do token: #{nft.id.replace('nft-', '00')}</p>
            <p>Coleção: {nft.collection}</p>
            <p>Atributos: Óculos, Esmeralda, Raro</p>
          </div>
        </div>

        {/* Barra de Ação Fixa Inferior Mobile (Buy Bar - Figma Node 70396:245) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card rounded-t-[40px] pt-4 pb-8 px-6 shadow-[0_-10px_30px_rgba(10,6,4,0.6)] border-t border-border flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[15px] font-medium text-text-secondary">Qtd.</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="size-[28px] rounded-[18px] bg-primary border border-ink flex items-center justify-center text-ink disabled:opacity-40 cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon className="size-3 text-ink" />
                </button>
                <span className="font-mono text-[18px] font-medium text-foreground w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= maxAvailable}
                  className="size-[28px] rounded-[18px] bg-primary border border-ink flex items-center justify-center text-ink disabled:opacity-40 cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon className="size-3 text-ink" />
                </button>
              </div>
            </div>

            <span className="font-mono text-[20px] font-bold text-text-accent">
              {formatEthValue(totalPrice)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-[56px] rounded-[40px] bg-gradient-to-r from-primary to-primary/80 hover:brightness-110 active:scale-95 text-ink font-mono font-bold text-[16px] flex items-center justify-center shadow-lg transition-all cursor-pointer"
            >
              Comprar NFT
            </Button>

            <Link
              to="/cart"
              className="size-[56px] rounded-[40px] bg-surface-raised border border-border flex items-center justify-center text-foreground hover:text-text-accent cursor-pointer shrink-0"
              aria-label="Ver carrinho"
            >
              <CartIcon className="size-5" />
            </Link>
          </div>

          {buyFeedback && (
            <p className="font-mono text-xs text-text-accent text-center animate-fade-in">
              {buyFeedback}
            </p>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VERSÃO DESKTOP & TABLET (1440px - Figma Node 10:244)      */}
      {/* ========================================================= */}
      <div className="hidden md:flex flex-col w-full max-w-[1440px] px-8 lg:px-[120px] py-6 sm:py-8 gap-[96px]">
        {/* 1. SEÇÃO PRINCIPAL (GALERIA + PAINEL DE COMPRA) */}
        <section className="flex flex-col gap-[32px] w-full">
          {/* Breadcrumb Literal (Figma Node 10:290) */}
          <nav className="font-mono text-[15px] font-bold text-foreground" aria-label="Navegação">
            <Link to="/" className="hover:text-text-accent">
              Início
            </Link>{' '}
            /{' '}
            <Link to="/" search={{ tab: 'all' }} className="hover:text-text-accent">
              Mercado
            </Link>
          </nav>

          <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
            {/* Galeria de Imagens à Esquerda (Figma Node 70363:239 - w: 573px) */}
            <div className="flex gap-[28px] items-center shrink-0 w-full lg:w-[573px]">
              {/* Miniaturas Verticais (Figma Node 70342:2682 - 100x100px cada) */}
              <div className="flex flex-col gap-[16px] shrink-0 w-[100px]">
                {galleryImages.map((imgSrc, index) => {
                  const isSelected = index === selectedImageIndex;
                  return (
                    <button
                      key={`desktop-thumb-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative size-[100px] rounded-[8px] overflow-hidden bg-surface-card transition-all cursor-pointer ${
                        isSelected
                          ? 'border border-primary ring-1 ring-primary'
                          : 'border border-transparent hover:border-border'
                      }`}
                      aria-label={`Selecionar imagem ${index + 1}`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${nft.title} miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Imagem Principal Grande (Figma Node 70342:2683 - 444x444px) */}
              <div className="relative size-[444px] bg-surface-card rounded-[6px] p-[16px] flex items-center justify-center shrink-0 shadow-xl">
                <img
                  src={galleryImages[selectedImageIndex]}
                  alt={nft.title}
                  className="size-[404px] rounded-[24px] object-cover pointer-events-none"
                  width={404}
                  height={404}
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Ícone de Zoom Lupa no Topo Direito */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute top-4 right-4 text-text-accent hover:brightness-110 cursor-pointer"
                  aria-label="Ampliar imagem do NFT (zoom em alta resolução)"
                >
                  <ZoomIcon className="size-[30px]" />
                </button>
              </div>

              {/* Modal de Zoom da Imagem (Acessível via Dialog / Escape) */}
              <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                <DialogContent className="max-w-[600px] bg-surface-card border border-border p-4 flex flex-col items-center gap-4">
                  <DialogHeader className="w-full">
                    <DialogTitle className="text-foreground text-lg font-bold">
                      {nft.title} (Alta Resolução)
                    </DialogTitle>
                  </DialogHeader>
                  <div className="w-full max-h-[70vh] overflow-hidden rounded-[12px] flex items-center justify-center">
                    <img
                      src={galleryImages[selectedImageIndex]}
                      alt={`${nft.title} em alta resolução`}
                      className="max-h-[70vh] w-auto object-contain rounded-[12px]"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Painel de Informações e Compra à Direita (Figma Node 70342:2763) */}
            <div className="flex-1 flex flex-col justify-between items-start gap-[24px] min-w-0 w-full self-stretch">
              {/* Título, Preço e Avaliações */}
              <div className="flex flex-col gap-[12px] w-full">
                <h1 className="font-mono text-[28px] font-bold text-foreground leading-normal">
                  {nft.title}
                </h1>

                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[22px] font-bold text-text-accent leading-[16px]">
                    {formatEthValue(nft.priceEth)}
                  </span>

                  <div className="flex items-center gap-[4px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={`star-${i}`} filled className="size-[15px]" />
                    ))}
                    <span className="font-mono text-[15px] font-normal text-foreground ml-1">
                      19 avaliações de colecionadores
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border my-1" />
              </div>

              {/* Sobre este NFT */}
              <div className="flex flex-col gap-[12px] w-full">
                <h2 className="font-mono text-[15px] font-bold text-foreground leading-[16px]">
                  Sobre este NFT:
                </h2>
                <p className="font-mono text-[14px] font-normal leading-[24px] text-text-secondary">
                  {nft.description}
                </p>
              </div>

              {/* Seletor de Edição */}
              <div className="flex flex-col gap-[12px] w-full">
                <span className="font-mono text-[15px] font-bold text-foreground leading-[16px]">
                  Edição:
                </span>
                <div className="flex items-center gap-[6px]">
                  {EDITIONS.map((ed) => {
                    const isSelected = ed.id === selectedEdition;
                    return (
                      <button
                        key={`desk-ed-${ed.id}`}
                        type="button"
                        onClick={() => {
                          setSelectedEdition(ed.id);
                          setQuantity(1);
                        }}
                        className={`h-[28px] px-3 rounded-full font-mono text-[14px] transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'border border-primary bg-primary/10 text-text-accent font-medium'
                            : 'border border-border bg-transparent text-text-secondary font-normal hover:text-foreground'
                        }`}
                      >
                        {ed.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controle de Quantidade, Comprar e Favoritar (Figma Node 70342:2762) */}
              <div className="flex items-center justify-between w-full pt-1">
                {/* Contador de Quantidade */}
                <div className="flex items-center gap-[12px]">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-[33px] h-[49px] rounded-[33px] bg-primary border border-ink flex items-center justify-center text-ink disabled:opacity-40 cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all"
                    aria-label="Diminuir quantidade"
                  >
                    <MinusIcon className="size-4 text-ink" />
                  </button>

                  <span className="font-mono text-[20px] font-normal leading-[28px] text-foreground px-2">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= maxAvailable}
                    className="w-[33px] h-[49px] rounded-[33px] bg-primary border border-ink flex items-center justify-center text-ink disabled:opacity-40 cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all"
                    aria-label="Aumentar quantidade"
                  >
                    <PlusIcon className="size-4 text-ink" />
                  </button>
                </div>

                {/* Botões Comprar e Favoritar */}
                <div className="flex items-center gap-[8px]">
                  <Button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-[130px] h-[40px] rounded-[6px] bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-bold text-[14px] leading-[20px] flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    COMPRAR
                  </Button>

                  <Button
                    type="button"
                    data-testid="detail-favorite-btn"
                    onClick={handleToggleFavorite}
                    variant="outline"
                    className={`w-[130px] h-[40px] rounded-[6px] border border-primary flex items-center justify-center gap-[8px] font-mono text-[14px] leading-[20px] transition-all cursor-pointer ${
                      nft.isFavorited
                        ? 'bg-primary/10 text-text-accent font-bold'
                        : 'text-text-accent font-medium hover:bg-surface-card'
                    }`}
                  >
                    <HeartIcon filled={nft.isFavorited} className="size-[20px]" />
                    <span>Favoritar</span>
                  </Button>
                </div>
              </div>

              {buyFeedback && (
                <p className="font-mono text-sm text-text-accent font-medium">{buyFeedback}</p>
              )}

              {/* Metadados do Token e Ações de Compartilhar */}
              <div className="flex flex-col gap-[12px] w-full pt-1">
                <div className="flex flex-col gap-[8px] font-mono text-[15px] font-normal text-secondary">
                  <p>ID do token: #{nft.id.replace('nft-', '00')}</p>
                  <p>Coleção: {nft.collection}</p>
                  <p>Atributos: Óculos, Esmeralda, Raro</p>
                </div>

                <div className="flex items-center gap-[8px] pt-1">
                  <span className="font-mono text-[15px] font-bold text-foreground">
                    Compartilhar este NFT:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1 hover:text-foreground text-text-accent transition-colors cursor-pointer"
                      aria-label="Compartilhar no LinkedIn"
                    >
                      <ShareLinkedinIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:text-foreground text-text-accent transition-colors cursor-pointer"
                      aria-label="Compartilhar por e-mail"
                    >
                      <ShareMailIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:text-foreground text-text-accent transition-colors cursor-pointer"
                      aria-label="Compartilhar no Twitter"
                    >
                      <ShareTwitterIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SEÇÃO DE ABAS: DETALHES DO NFT / AVALIAÇÕES (Figma Node 70342:2780) */}
        <section className="flex flex-col gap-[20px] w-full border-t border-border pt-8">
          <div className="flex items-center gap-[32px] relative border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`font-mono text-[17px] leading-[16px] transition-colors relative cursor-pointer pb-2 ${
                activeTab === 'details'
                  ? 'font-bold text-text-accent'
                  : 'font-normal text-foreground hover:text-text-accent'
              }`}
            >
              Detalhes do NFT
              {activeTab === 'details' && (
                <span className="absolute -bottom-3 left-0 right-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`font-mono text-[17px] leading-[16px] transition-colors relative cursor-pointer pb-2 ${
                activeTab === 'reviews'
                  ? 'font-bold text-text-accent'
                  : 'font-normal text-foreground hover:text-text-accent'
              }`}
            >
              Avaliações de colecionadores (19)
              {activeTab === 'reviews' && (
                <span className="absolute -bottom-3 left-0 right-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="flex flex-col gap-6 font-mono text-[14px] text-text-secondary leading-[24px]">
              <p>
                {nft.title} é uma obra digital {selectedEdition} finalizada à mão da coleção Kurio
                Editions. Cada atributo fica armazenado nos metadados do token e verificado na{' '}
                {nft.network}. A obra explora identidade, movimento e luz em um mundo digital sem
                fronteiras.
              </p>
              <p>
                A propriedade inclui a arte em alta resolução, lançamentos exclusivos para
                colecionadores e um registro permanente de procedência registrada na rede.{' '}
                {nft.creator.name} recebe 5% de direitos autorais nas vendas secundárias, apoiando
                novos trabalhos e lançamentos da comunidade.
              </p>

              <div className="flex flex-col gap-1 pt-2">
                <p className="font-bold text-foreground">Rede:</p>
                <p>Cunhado na {nft.network} com procedência imutável e metadados no IPFS.</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-bold text-foreground">Contrato:</p>
                <p>
                  Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente
                  pelos mercados compatíveis.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-bold text-foreground">Direitos autorais:</p>
                <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={`rev-star-${i}`} filled className="size-4" />
                  ))}
                </div>
                <span className="font-mono text-sm text-foreground font-bold">4.8 de 5</span>
                <span className="font-mono text-sm text-text-secondary">
                  (19 avaliações verificadas de colecionadores)
                </span>
              </div>
              <p className="font-mono text-xs text-text-secondary">
                Todas as avaliações são registradas por carteiras verificadas na rede.
              </p>
            </div>
          )}
        </section>

        {/* 3. SEÇÃO "MAIS DESTA COLEÇÃO" (Figma Node 70364:239) */}
        <section className="flex flex-col gap-[32px] w-full">
          <div className="flex flex-col gap-[12px] w-full border-b border-border pb-3">
            <h2 className="font-mono text-[17px] font-bold text-text-accent leading-[16px]">
              Mais desta coleção
            </h2>
          </div>

          <div className="flex flex-col gap-[32px] items-center w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[24px] justify-between w-full">
              {relatedData?.data?.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  to="/nfts/$id"
                  params={{ id: item.id }}
                  className="flex flex-col gap-[12px] items-start w-full group transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="bg-surface-card h-[255px] w-full p-[4px] rounded-[6px] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="size-[212px] rounded-[13px] object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="font-mono text-[15px] font-normal text-foreground truncate w-full">
                      {item.title}
                    </p>
                    <p className="font-mono text-[16px] font-bold text-text-accent">
                      {formatEthValue(item.priceEth)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Dots do Carrossel (Figma Node 70364:240) */}
            <div className="flex items-center gap-1.5 pt-2">
              <span className="size-2 rounded-full bg-primary" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
