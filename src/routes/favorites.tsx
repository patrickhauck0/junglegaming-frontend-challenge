import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useFavorites } from '@/hooks/useNfts';
import { NftCard } from '@/components/home/NftCard';
import { HeartIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui';

export const Route = createFileRoute('/favorites')({
  beforeLoad: ({ location }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('__kurio_auth_token__') : null;
    if (!token) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: FavoritesPage,
});

function FavoritesPage() {
  const { data: favorites, isLoading, isError, refetch } = useFavorites();

  const items = favorites || [];

  return (
    <div className="min-h-screen bg-ink text-foreground font-mono">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] pt-6 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-7">
          <p className="font-mono font-bold text-[15px] leading-[16px] text-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Início
            </Link>{' '}
            /{' '}
            <span className="text-foreground">Favoritos</span>
          </p>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-8 border-b border-primary/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-accent">
              <HeartIcon filled className="size-4" />
            </div>
            <h1 className="font-mono font-bold text-2xl md:text-3xl text-foreground">
              Seus NFTs Favoritos
            </h1>
          </div>
          <p className="text-[14px] text-secondary">
            Acompanhe as obras digitais que você favoritou na Kurio.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            role="status"
            aria-label="Carregando favoritos"
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-surface-card rounded-[18px] lg:rounded-[20px] h-[260px] sm:h-[340px] lg:h-[400px] p-4 flex flex-col gap-3 animate-pulse"
              >
                <div className="bg-[#3F2319] w-full flex-1 rounded-[15px]" />
                <div className="h-4 w-3/4 bg-[#3F2319] rounded" />
                <div className="h-4 w-1/2 bg-[#3F2319]/70 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-surface-card border border-red-700/50 rounded-[8px] p-8 text-center max-w-lg mx-auto my-12">
            <p className="text-lg font-bold text-red-300 mb-2">Erro ao carregar favoritos</p>
            <p className="text-sm text-secondary mb-6">
              Não foi possível sincronizar sua lista de favoritos com a rede blockchain.
            </p>
            <Button
              type="button"
              onClick={() => refetch()}
              className="bg-primary text-ink font-bold hover:bg-[#E89B55]"
            >
              Tentar novamente
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-surface-card border border-border rounded-[8px] p-12 text-center max-w-xl mx-auto my-12 flex flex-col items-center">
            <div className="size-16 rounded-full bg-surface-raised border border-border flex items-center justify-center text-secondary mb-4">
              <HeartIcon className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Você ainda não tem favoritos
            </h2>
            <p className="text-sm text-secondary mb-6 max-w-md leading-relaxed">
              Explore o catálogo da Kurio, descubra obras de arte digital exclusivas e clique no ícone de coração para salvá-las aqui.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center h-11 px-8 rounded-[4px] bg-primary text-ink font-bold text-[15px] hover:bg-[#E89B55] transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
