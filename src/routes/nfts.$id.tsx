import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/nfts/$id')({
  component: NftDetailsPage,
});

function NftDetailsPage() {
  const { id } = Route.useParams();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Detalhes do NFT</h1>
      <p className="text-sm text-text-secondary">
        Exibindo informações detalhadas da obra #{id}.
      </p>
    </div>
  );
}
