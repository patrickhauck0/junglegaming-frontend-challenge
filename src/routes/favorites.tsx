import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/favorites')({
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">NFTs Favoritos</h1>
      <p className="text-sm text-text-secondary">Lista de obras salvas na sua coleção de favoritos.</p>
    </div>
  );
}
