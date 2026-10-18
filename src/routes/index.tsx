import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useNfts } from '@/hooks/useNfts';
import { NftCard } from '@/components/home/NftCard';
import { FiltersSidebar, type FiltersState } from '@/components/home/FiltersSidebar';
import { ShimmerSkeleton } from '@/components/skeletons/ShimmerSkeleton';
import {
  SearchIcon,
  FilterSlidersIcon,
  ArrowRightIcon,
  ArrowDownIcon,
} from '@/components/ui/icons';

const CatalogSearchParamsSchema = z.object({
  search: z.string().optional(),
  collections: z.array(z.string()).optional(),
  networks: z.array(z.string()).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  tab: z.enum(['all', 'new', 'trending']).optional(),
  sortBy: z.enum(['recent', 'price-asc', 'price-desc', 'likes']).optional(),
  page: z.number().int().min(1).optional(),
});

export type CatalogSearchParams = z.infer<typeof CatalogSearchParamsSchema>;

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => {
    return CatalogSearchParamsSchema.parse(search);
  },
  component: HomePage,
});

function HomePage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSearchInput, setMobileSearchInput] = useState(searchParams.search || '');

  // Parâmetros consolidados
  const currentTab = searchParams.tab || 'all';
  const currentSort = searchParams.sortBy || 'recent';
  const currentPage = searchParams.page || 1;

  // Consulta TanStack Query com AbortSignal
  const { data, isLoading, isError, refetch } = useNfts({
    search: searchParams.search,
    collections: searchParams.collections,
    networks: searchParams.networks,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    tab: currentTab,
    sortBy: currentSort,
    page: currentPage,
    limit: 9,
  });

  const updateSearch = (newParams: Partial<CatalogSearchParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newParams,
      }),
    });
  };

  const handleTabChange = (tab: 'all' | 'new' | 'trending') => {
    updateSearch({ tab, page: 1 });
  };

  const handleSortChange = (sortBy: 'recent' | 'price-asc' | 'price-desc' | 'likes') => {
    updateSearch({ sortBy, page: 1 });
  };

  const handleFilterChange = (filters: FiltersState) => {
    updateSearch({
      collections: filters.collections,
      networks: filters.networks,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      page: 1, // Resetar para página 1 ao filtrar
    });
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch({ search: mobileSearchInput ? mobileSearchInput : undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateSearch({ page });
    const el = document.getElementById('products-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. SEÇÃO HERO (Figma Node 70347:239) */}
      <section className="w-full max-w-[1440px] px-4 sm:px-8 lg:px-[120px] pt-6 pb-16">
        {/* Barra de Busca e Filtro Superior no Mobile (390px - Figma Node 14:5226) */}
        <div className="flex md:hidden items-center gap-3 mb-6 w-full">
          <form
            onSubmit={handleMobileSearchSubmit}
            className="flex-1 bg-surface-card border border-border rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5"
          >
            <SearchIcon className="size-5 text-secondary shrink-0" />
            <input
              type="text"
              value={mobileSearchInput}
              onChange={(e) => setMobileSearchInput(e.target.value)}
              placeholder="Explorar coleções"
              className="bg-transparent font-mono text-[14px] text-foreground placeholder:text-secondary focus-visible:outline-none w-full"
              aria-label="Explorar coleções e NFTs"
            />
          </form>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="size-[45px] rounded-[10px] bg-primary flex items-center justify-center text-ink shrink-0 shadow-md focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer"
            aria-label="Abrir filtros"
          >
            <FilterSlidersIcon className="size-5 text-ink" />
          </button>
        </div>

        {/* Hero Mobile (Figma Frame 14:5226 - 190px de altura) */}
        <div
          className="flex md:hidden relative w-full rounded-[16px] border border-border/80 overflow-hidden p-4 items-center"
          style={{
            backgroundImage:
              'radial-gradient(130% 100% at 90% 50%, rgba(210, 138, 76, 0.35) 0%, rgba(36, 22, 18, 0.95) 70%, #140D0A 100%)',
          }}
        >
          <div className="flex flex-col gap-1.5 max-w-[190px] z-10">
            <span className="font-mono text-[11px] font-normal text-foreground">
              Bem-vindo à Kurio
            </span>
            <h1 className="font-mono text-[16px] font-bold text-foreground leading-[20px]">
              SEJA DONO DA
              <br />
              CULTURA DIGITAL
            </h1>
            <p className="font-mono text-[10px] text-text-secondary leading-[14px] mt-0.5">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-text-accent mt-2 hover:underline cursor-pointer"
            >
              <span>EXPLORAR</span>
              <ArrowRightIcon className="size-3" />
            </button>
          </div>

          {/* Imagens do Macaco sobrepostas Mobile */}
          <div className="absolute right-3 top-3 bottom-3 flex items-center">
            <div className="relative size-[115px] rounded-[16px] overflow-hidden shadow-lg border border-border">
              <img
                src="/assets/nfts/emerald-ape.webp"
                alt="Emerald Ape #042"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-1 -left-4 size-[48px] rounded-[12px] overflow-hidden border-2 border-surface-card shadow-xl">
              <img
                src="/assets/nfts/sage-nomad.webp"
                alt="Sage Nomad #009"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Dots de Paginação Mobile */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-secondary/60" />
            <span className="size-1.5 rounded-full bg-secondary/60" />
          </div>
        </div>

        {/* Hero Desktop (Figma Node 70347:239 - 450px) */}
        <div className="hidden md:flex relative w-full h-[450px] items-center justify-between">
          <div className="flex flex-col gap-[20px] max-w-[580px] z-10">
            <div className="flex flex-col gap-[8px]">
              <span className="font-mono text-[14px] font-bold tracking-[1.4px] text-foreground uppercase">
                Bem-vindo à Kurio
              </span>
              <h1 className="font-mono text-[42px] lg:text-[46px] font-bold text-foreground leading-[1.1] tracking-tight">
                SEJA DONO DO FUTURO
                <br />
                DA ARTE DIGITAL
              </h1>
            </div>

            <p className="font-mono text-[14px] text-text-secondary leading-[24px]">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da
              cultura da internet.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-bold text-[16px] px-[28px] py-[12px] rounded-[6px] transition-all shadow-md focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer"
              >
                EXPLORAR
              </button>
            </div>
          </div>

          {/* Imagem Hero Grande à Direita (Figma 430px) */}
          <div className="relative size-[380px] lg:size-[430px] rounded-[24px] overflow-hidden shadow-2xl shrink-0 flex items-center justify-center bg-[#241612]">
            <img
              src="/assets/nfts/emerald-ape.webp"
              alt="Emerald Ape #042 - Destaque Principal"
              className="w-full h-full object-cover"
              width={430}
              height={430}
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Dots de Paginação Desktop centralizados */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-[6px]">
            <span className="size-[8px] rounded-full bg-primary" />
            <span className="size-[8px] rounded-full bg-[#3F2319]" />
            <span className="size-[8px] rounded-full bg-[#3F2319]" />
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO PRODUCTS (SIDEBAR + CATÁLOGO) (Figma Node 70342:2831) */}
      <section
        id="products-section"
        className="w-full max-w-[1440px] px-4 sm:px-8 lg:px-[120px] pb-24"
      >
        <div className="flex items-start gap-[48px]">
          {/* Sidebar de Filtros no Desktop (310px) */}
          <FiltersSidebar
            filters={{
              collections: searchParams.collections,
              networks: searchParams.networks,
              minPrice: searchParams.minPrice,
              maxPrice: searchParams.maxPrice,
            }}
            onChange={handleFilterChange}
          />

          {/* Drawer de Filtros Mobile */}
          {mobileDrawerOpen && (
            <FiltersSidebar
              isMobileDrawer
              onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
              filters={{
                collections: searchParams.collections,
                networks: searchParams.networks,
                minPrice: searchParams.minPrice,
                maxPrice: searchParams.maxPrice,
              }}
              onChange={(updated) => {
                handleFilterChange(updated);
                setMobileDrawerOpen(false);
              }}
            />
          )}

          {/* Coluna Principal do Grid (Figma Node 70342:2830) */}
          <div className="flex-1 flex flex-col gap-[32px] w-full min-w-0">
            {/* Toolbar Superior: Abas e Ordenação (Figma Node 70351:239) */}
            <div className="flex items-center justify-between w-full relative pb-[12px] border-b border-border">
              {/* Abas */}
              <div className="flex items-center gap-[16px] sm:gap-[20px] font-mono text-[14px] sm:text-[15px] font-medium leading-[16px]" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={currentTab === 'all'}
                  onClick={() => handleTabChange('all')}
                  className={`relative py-1 cursor-pointer transition-colors ${
                    currentTab === 'all'
                      ? 'text-text-accent font-bold'
                      : 'text-foreground hover:text-text-accent'
                  }`}
                >
                  Todos os NFTs
                  {currentTab === 'all' && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-primary z-10" />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={currentTab === 'new'}
                  onClick={() => handleTabChange('new')}
                  className={`relative py-1 cursor-pointer transition-colors ${
                    currentTab === 'new'
                      ? 'text-text-accent font-bold'
                      : 'text-foreground hover:text-text-accent'
                  }`}
                >
                  Novos lançamentos
                  {currentTab === 'new' && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-primary z-10" />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={currentTab === 'trending'}
                  onClick={() => handleTabChange('trending')}
                  className={`relative py-1 cursor-pointer transition-colors ${
                    currentTab === 'trending'
                      ? 'text-text-accent font-bold'
                      : 'text-foreground hover:text-text-accent'
                  }`}
                >
                  Em alta
                  {currentTab === 'trending' && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-primary z-10" />
                  )}
                </button>
              </div>

              {/* Ordenação Desktop (Figma Node 70351:241 - hidden no mobile conforme frame 14:5226) */}
              <div className="hidden md:flex items-center gap-[6px] font-mono text-[15px] font-normal text-foreground">
                <span>Ordenar por:</span>
                <div className="relative">
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value as any)}
                    className="appearance-none bg-transparent pl-1 pr-6 py-1 font-mono text-[15px] text-foreground focus-visible:outline-none cursor-pointer"
                    aria-label="Opções de ordenação do catálogo"
                  >
                    <option value="recent" className="bg-surface-card text-foreground">
                      Listados recentemente
                    </option>
                    <option value="price-asc" className="bg-surface-card text-foreground">
                      Menor preço
                    </option>
                    <option value="price-desc" className="bg-surface-card text-foreground">
                      Maior preço
                    </option>
                    <option value="likes" className="bg-surface-card text-foreground">
                      Mais populares
                    </option>
                  </select>
                  <ArrowDownIcon className="absolute right-1 top-1/2 -translate-y-1/2 size-3 text-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid de Cards de NFTs (Figma Node 70342:2828: 3 colunas desktop, 2 colunas mobile) */}
            {isLoading ? (
              <div
                role="status"
                aria-label="Carregando catálogo de NFTs"
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-4 lg:gap-x-[34px] gap-y-6 sm:gap-y-8 lg:gap-y-[72px] justify-items-center"
              >
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex flex-col gap-[12px] w-full max-w-[258px]"
                  >
                    <ShimmerSkeleton className="w-full h-[180px] sm:h-[240px] lg:h-[300px] rounded-[18px]" />
                    <ShimmerSkeleton className="w-3/4 h-4 rounded" />
                    <ShimmerSkeleton className="w-1/2 h-4 rounded" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center p-12 bg-surface-card rounded-xl text-center">
                <p className="font-mono text-base font-bold text-text-coral mb-2">
                  Falha ao carregar os NFTs do catálogo
                </p>
                <p className="font-mono text-sm text-text-secondary mb-4">
                  Ocorreu um erro na requisição à API simulada.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="bg-primary hover:brightness-110 text-ink font-mono font-bold text-xs uppercase px-4 py-2 rounded transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-4 lg:gap-x-[34px] gap-y-6 sm:gap-y-8 lg:gap-y-[72px] justify-items-center">
                {data.data.map((nft) => (
                  <NftCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-surface-card rounded-xl text-center">
                <p className="font-mono text-base font-bold text-foreground mb-2">
                  Nenhum NFT encontrado
                </p>
                <p className="font-mono text-sm text-text-secondary mb-4">
                  Tente ajustar ou limpar os filtros para visualizar mais itens.
                </p>
                <button
                  type="button"
                  onClick={() => handleFilterChange({})}
                  className="bg-primary hover:brightness-110 text-ink font-mono font-bold text-xs uppercase px-4 py-2 rounded transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Paginação Numérica Fiel ao Figma (Figma Node 70342:2825: size 35x35px, alinhado à direita) */}
            <nav
              className="flex items-center justify-end gap-[8px] pt-8"
              aria-label="Paginação do catálogo"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={`page-${pageNum}`}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`size-[35px] rounded-[4px] flex items-center justify-center font-mono text-[18px] leading-[16px] transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                      isActive
                        ? 'bg-primary text-ink font-bold'
                        : 'border border-border bg-transparent text-foreground font-normal hover:border-primary/60'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Página ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className="size-[35px] rounded-[4px] border border-border bg-transparent text-foreground flex items-center justify-center transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                aria-label="Próxima página"
              >
                <ArrowRightIcon className="size-4" />
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO PROMOS (2 CARDS HORIZONTAIS) (Figma Node 70353:241) */}
      <section className="w-full max-w-[1440px] px-4 sm:px-8 lg:px-[120px] pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Promo Card 1: Genesis Drops */}
          <div className="relative min-h-[250px] rounded-[8px] overflow-hidden bg-surface-card border border-border/40 flex flex-row items-center justify-between shadow-xl">
            <div className="w-[140px] sm:w-[220px] md:w-[260px] h-[250px] overflow-hidden shrink-0">
              <img
                src="/assets/nfts/emerald-ape.webp"
                alt="Lançamentos gênesis"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 p-4 sm:p-6 flex flex-col items-end text-right gap-2 z-10">
              <h2 className="font-mono text-[15px] sm:text-[18px] font-bold text-foreground leading-[19px] sm:leading-[22px]">
                Lançamentos gênesis
                <br />
                de edição limitada
              </h2>
              <p className="font-mono text-[11px] sm:text-[12px] text-text-secondary leading-[15px] sm:leading-[16px] max-w-[240px]">
                Colecione edições escassas diretamente dos criadores antes da revelação pública.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleTabChange('new');
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-1 sm:mt-2 bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-medium text-[12px] sm:text-[13px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[6px] transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer"
              >
                <span>Explorar</span>
                <ArrowRightIcon className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Promo Card 2: Curated Art */}
          <div className="relative min-h-[250px] rounded-[8px] overflow-hidden bg-surface-card border border-border/40 flex flex-row items-center justify-between shadow-xl">
            <div className="w-[140px] sm:w-[220px] md:w-[260px] h-[250px] overflow-hidden shrink-0">
              <img
                src="/assets/nfts/ivory-baron.webp"
                alt="Arte digital selecionada"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 p-4 sm:p-6 flex flex-col items-end text-right gap-2 z-10">
              <h2 className="font-mono text-[15px] sm:text-[18px] font-bold text-foreground leading-[19px] sm:leading-[22px]">
                Arte digital selecionada
                <br />
                e muito mais
              </h2>
              <p className="font-mono text-[11px] sm:text-[12px] text-text-secondary leading-[15px] sm:leading-[16px] max-w-[240px]">
                Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleTabChange('trending');
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-1 sm:mt-2 bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-medium text-[12px] sm:text-[13px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[6px] transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer"
              >
                <span>Explorar</span>
                <ArrowRightIcon className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO BLOG (DIÁRIO DA CUNHAGEM) (Figma Node 70343:253) */}
      <section className="w-full max-w-[1440px] px-4 sm:px-8 lg:px-[120px] pb-16">
        <div className="flex flex-col gap-10 items-center">
          <div className="text-center flex flex-col gap-2 max-w-xl">
            <h2 className="font-mono text-[28px] font-bold text-foreground">
              Diário da Cunhagem
            </h2>
            <p className="font-mono text-[14px] text-text-secondary">
              Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Blog Card 1 */}
            <article className="bg-surface-card rounded-[8px] overflow-hidden flex flex-col group border border-border/40 hover:border-primary/50 transition-colors">
              <div className="h-[195px] overflow-hidden">
                <img
                  src="/assets/nfts/ivory-baron.webp"
                  alt="Como funciona a propriedade de NFTs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="font-mono text-[11px] text-text-secondary">
                  12 de setembro | Leitura de 6 min
                </span>
                <h3 className="font-mono text-[15px] font-bold text-foreground leading-snug">
                  Como funciona a propriedade de NFTs
                </h3>
                <p className="font-mono text-[12px] text-text-secondary leading-relaxed">
                  Aprenda a colecionar, negociar e verificar ativos digitais.
                </p>
                <span className="font-mono text-[12px] font-bold text-text-accent mt-auto pt-2 flex items-center gap-1">
                  Ler mais →
                </span>
              </div>
            </article>

            {/* Blog Card 2 */}
            <article className="bg-surface-card rounded-[8px] overflow-hidden flex flex-col group border border-border/40 hover:border-primary/50 transition-colors">
              <div className="h-[195px] overflow-hidden">
                <img
                  src="/assets/nfts/emerald-ape.webp"
                  alt="10 artistas digitais para acompanhar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="font-mono text-[11px] text-text-secondary">
                  13 de setembro | Leitura de 2 min
                </span>
                <h3 className="font-mono text-[15px] font-bold text-foreground leading-snug">
                  10 artistas digitais para acompanhar
                </h3>
                <p className="font-mono text-[12px] text-text-secondary leading-relaxed">
                  Conheça criadores que moldam a cultura digital.
                </p>
                <span className="font-mono text-[12px] font-bold text-text-accent mt-auto pt-2 flex items-center gap-1">
                  Ler mais →
                </span>
              </div>
            </article>

            {/* Blog Card 3 */}
            <article className="bg-surface-card rounded-[8px] overflow-hidden flex flex-col group border border-border/40 hover:border-primary/50 transition-colors">
              <div className="h-[195px] overflow-hidden">
                <img
                  src="/assets/nfts/sage-nomad.webp"
                  alt="Raridade, atributos e procedência"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="font-mono text-[11px] text-text-secondary">
                  15 de setembro | Leitura de 3 min
                </span>
                <h3 className="font-mono text-[15px] font-bold text-foreground leading-snug">
                  Raridade, atributos e procedência
                </h3>
                <p className="font-mono text-[12px] text-text-secondary leading-relaxed">
                  Entenda raridade, procedência, direitos autorais e utilidade.
                </p>
                <span className="font-mono text-[12px] font-bold text-text-accent mt-auto pt-2 flex items-center gap-1">
                  Ler mais →
                </span>
              </div>
            </article>

            {/* Blog Card 4 */}
            <article className="bg-surface-card rounded-[8px] overflow-hidden flex flex-col group border border-border/40 hover:border-primary/50 transition-colors">
              <div className="h-[195px] overflow-hidden">
                <img
                  src="/assets/nfts/golden-beat.webp"
                  alt="Como proteger sua carteira"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="font-mono text-[11px] text-text-secondary">
                  15 de setembro | Leitura de 2 min
                </span>
                <h3 className="font-mono text-[15px] font-bold text-foreground leading-snug">
                  Como proteger sua carteira
                </h3>
                <p className="font-mono text-[12px] text-text-secondary leading-relaxed">
                  Proteja sua carteira, seus ativos e sua identidade.
                </p>
                <span className="font-mono text-[12px] font-bold text-text-accent mt-auto pt-2 flex items-center gap-1">
                  Ler mais →
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
