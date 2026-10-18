import React from 'react';
import { Link } from '@tanstack/react-router';
import type { Nft } from '@/contracts/nft';
import { formatEthValue } from '@/utils/formatters';
import { HeartIcon } from '@/components/ui/icons';
import { useToggleFavorite } from '@/hooks/useNfts';

interface NftCardProps {
  nft: Nft;
}

export function NftCard({ nft }: NftCardProps) {
  const toggleFavorite = useToggleFavorite();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite.mutate({ nftId: nft.id, isFavorited: !nft.isFavorited });
  };

  const isRare = nft.availableEditions <= 3 || nft.isFeatured;

  return (
    <article
      className="group relative flex flex-col gap-[12px] items-start w-full max-w-[258px] transition-transform duration-200 hover:-translate-y-1"
      aria-label={`NFT ${nft.title}`}
    >
      <Link
        to="/nfts/$id"
        params={{ id: nft.id }}
        className="flex flex-col gap-[12px] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[15px]"
      >
        {/* Caixa de fundo da imagem (Figma: h-[300px] w-full bg-[#241612] com cantos arredondados) */}
        <div className="bg-surface-card w-full h-[180px] sm:h-[240px] lg:h-[300px] rounded-[18px] lg:rounded-[20px] relative flex items-center justify-center p-[4px] overflow-hidden">
          <img
            src={nft.imageUrl}
            alt={nft.title}
            className="rounded-[15px] size-[160px] sm:size-[210px] lg:size-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
            width={250}
            height={250}
            loading="lazy"
          />

          {/* Badge RARO visível no mobile conforme Figma 14:5226 */}
          {isRare && (
            <div className="md:hidden absolute top-0 left-0 bg-primary text-ink text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-br-[6px] shadow-sm">
              RARO
            </div>
          )}

          {/* Botão de Favoritar: visível no mobile conforme Figma 14:5226, e no desktop em hover */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="md:opacity-0 md:group-hover:opacity-100 absolute top-2 right-2 size-[28px] sm:size-[30px] rounded-full bg-surface-dark/70 hover:bg-surface-dark border border-border/40 flex items-center justify-center text-text-accent transition-all shadow-md focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={nft.isFavorited ? `Desfavoritar ${nft.title}` : `Favoritar ${nft.title}`}
          >
            <HeartIcon filled={nft.isFavorited} className="size-3.5 sm:size-4" />
          </button>
        </div>

        {/* Metadados: Título e Preço alinhados à esquerda (Figma: Roboto Mono) */}
        <div className="flex flex-col gap-[4px] lg:gap-[6px] items-start w-full">
          <h3 className="font-mono text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[16px] text-foreground truncate w-full">
            {nft.title}
          </h3>

          <div className="flex items-center gap-[8px] lg:gap-[12px] leading-[16px] whitespace-nowrap">
            <span className="font-mono text-[14px] sm:text-[16px] lg:text-[18px] font-bold text-text-accent">
              {formatEthValue(nft.priceEth)}
            </span>

            {nft.originalPriceEth && (
              <span className="font-mono text-[12px] sm:text-[14px] lg:text-[16px] font-normal text-secondary line-through">
                {formatEthValue(nft.originalPriceEth)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
