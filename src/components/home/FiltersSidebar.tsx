import { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui';

interface FilterOption {
  label: string;
  count: number;
}

const COLLECTIONS: FilterOption[] = [
  { label: 'Arte digital', count: 33 },
  { label: 'Fotografia', count: 12 },
  { label: 'Música', count: 65 },
  { label: 'Arte 3D', count: 39 },
  { label: 'Colecionáveis', count: 23 },
  { label: 'Generativa', count: 17 },
  { label: 'Jogos', count: 19 },
  { label: 'Assinaturas', count: 13 },
  { label: 'Utilidade', count: 18 },
];

const NETWORKS: FilterOption[] = [
  { label: 'Ethereum', count: 119 },
  { label: 'Polygon', count: 78 },
  { label: 'Solana', count: 86 },
];

export interface FiltersState {
  collections?: string[];
  networks?: string[];
  minPrice?: string;
  maxPrice?: string;
}

interface FiltersSidebarProps {
  filters: FiltersState;
  onChange: (updated: FiltersState) => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function FiltersSidebar({
  filters,
  onChange,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: FiltersSidebarProps) {
  // Faixa de preço (0.02 ETH a 12.30 ETH por padrão)
  const [minVal, setMinVal] = useState<number>(
    filters.minPrice ? parseFloat(filters.minPrice) : 0.02
  );
  const [maxVal, setMaxVal] = useState<number>(
    filters.maxPrice ? parseFloat(filters.maxPrice) : 12.30
  );

  useEffect(() => {
    if (filters.minPrice) setMinVal(parseFloat(filters.minPrice));
    if (filters.maxPrice) setMaxVal(parseFloat(filters.maxPrice));
  }, [filters.minPrice, filters.maxPrice]);

  const toggleCollection = (collection: string) => {
    const current = filters.collections || [];
    const next = current.includes(collection)
      ? current.filter((c) => c !== collection)
      : [...current, collection];
    onChange({ ...filters, collections: next.length > 0 ? next : undefined });
  };

  const toggleNetwork = (network: string) => {
    const current = filters.networks || [];
    const next = current.includes(network)
      ? current.filter((n) => n !== network)
      : [...current, network];
    onChange({ ...filters, networks: next.length > 0 ? next : undefined });
  };

  const handleApplyPrice = () => {
    onChange({
      ...filters,
      minPrice: minVal.toFixed(2),
      maxPrice: maxVal.toFixed(2),
    });
  };

  // Cálculo das porcentagens para o slider duplo
  const minPercent = Math.max(0, Math.min(100, ((minVal - 0.02) / (12.30 - 0.02)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxVal - 0.02) / (12.30 - 0.02)) * 100));

  const content = (
    <div className="flex flex-col gap-[40px] w-full">
      {/* Cabeçalho do Drawer se Mobile */}
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="font-mono text-[18px] font-bold text-foreground">Filtros</h2>
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="p-1 rounded text-text-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Fechar painel de filtros"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>
      )}

      {/* 1. Coleções (Figma Node 70485:318) */}
      <div className="flex flex-col gap-[12px] items-start w-full">
        <h3 className="font-mono text-[18px] font-bold leading-[16px] text-foreground">
          Coleções
        </h3>
        <div className="flex flex-col items-start px-[12px] w-full">
          {COLLECTIONS.map(({ label, count }) => {
            const isSelected = filters.collections?.includes(label) ?? false;
            return (
              <Button
                key={label}
                type="button"
                variant="ghost"
                onClick={() => toggleCollection(label)}
                className="flex items-center justify-between w-full h-[40px] text-left cursor-pointer group select-none transition-colors p-0 hover:bg-transparent rounded-none"
              >
                <span
                  className={`font-mono text-[15px] leading-[40px] ${
                    isSelected
                      ? 'text-text-accent font-bold'
                      : 'text-text-secondary group-hover:text-foreground font-normal'
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`font-mono text-[15px] font-bold leading-[40px] text-right ${
                    isSelected ? 'text-text-accent' : 'text-text-secondary'
                  }`}
                >
                  ({count})
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* 2. Faixa de Preço (Figma Node 70485:357) */}
      <div className="flex flex-col gap-[12px] items-start w-full">
        <h3 className="font-mono text-[18px] font-bold leading-[16px] text-foreground">
          Faixa de preço
        </h3>
        <div className="flex flex-col gap-[12px] items-start pl-[12px] w-full">
          {/* Double Range Slider exato do Figma */}
          <div className="relative w-full h-[18px] flex items-center select-none pt-2">
            {/* Trilho base escuro */}
            <div className="absolute left-0 right-0 h-[3px] bg-border rounded-full" />

            {/* Trilho preenchido em destaque */}
            <div
              className="absolute h-[3px] bg-primary rounded-full"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />

            {/* Inputs range nativos invisíveis sobrepostos para controle tátil/mouse */}
            <input
              type="range"
              min="0.02"
              max="12.30"
              step="0.01"
              value={minVal}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), maxVal - 0.5);
                setMinVal(Number(val.toFixed(2)));
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto z-20"
              aria-label="Preço mínimo em ETH"
            />
            <input
              type="range"
              min="0.02"
              max="12.30"
              step="0.01"
              value={maxVal}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), minVal + 0.5);
                setMaxVal(Number(val.toFixed(2)));
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto z-20"
              aria-label="Preço máximo em ETH"
            />

            {/* Knobs circulares fiéis ao Figma (size: 15px) */}
            <div
              className="absolute size-[15px] rounded-full bg-primary shadow pointer-events-none -translate-x-1/2 z-10"
              style={{ left: `${minPercent}%` }}
            />
            <div
              className="absolute size-[15px] rounded-full bg-primary shadow pointer-events-none -translate-x-1/2 z-10"
              style={{ left: `${maxPercent}%` }}
            />
          </div>

          {/* Texto de Preço Fiel: Preço: 0,02 - 12,30 ETH */}
          <div className="flex items-center w-full">
            <p className="font-mono text-[15px] font-normal text-foreground whitespace-nowrap">
              Preço:{' '}
              {minVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              -{' '}
              {maxVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              ETH
            </p>
          </div>

          {/* Botão Aplicar (Figma: w-auto px-[12px] py-[8px] bg-[#D28A4C] rounded-[6px]) */}
          <Button
            type="button"
            onClick={handleApplyPrice}
            className="bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-bold text-[16px] leading-[20px] px-[12px] py-[8px] rounded-[6px] cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-foreground h-auto"
          >
            Aplicar
          </Button>
        </div>
      </div>

      {/* 3. Rede (Figma Node 70485:369) */}
      <div className="flex flex-col gap-[12px] items-start w-full">
        <h3 className="font-mono text-[18px] font-bold leading-[16px] text-foreground">
          Rede
        </h3>
        <div className="flex flex-col items-start pl-[12px] w-full">
          {NETWORKS.map(({ label, count }) => {
            const isSelected = filters.networks?.includes(label) ?? false;
            return (
              <Button
                key={label}
                type="button"
                variant="ghost"
                onClick={() => toggleNetwork(label)}
                className="flex items-center justify-between w-full h-[40px] text-left cursor-pointer group select-none transition-colors p-0 hover:bg-transparent rounded-none"
              >
                <span
                  className={`font-mono text-[15px] leading-[40px] ${
                    isSelected
                      ? 'text-text-accent font-bold'
                      : 'text-text-secondary group-hover:text-foreground font-normal'
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`font-mono text-[15px] font-bold leading-[40px] text-right ${
                    isSelected ? 'text-text-accent' : 'text-text-secondary'
                  }`}
                >
                  ({count})
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Limpar Filtros se houver ativos */}
      {(filters.collections?.length || filters.networks?.length || filters.minPrice || filters.maxPrice) && (
        <button
          type="button"
          onClick={() => {
            setMinVal(0.02);
            setMaxVal(12.30);
            onChange({});
          }}
          className="font-mono text-[13px] text-text-accent hover:underline text-left -mt-2 cursor-pointer"
        >
          Limpar todos os filtros
        </button>
      )}
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div
        className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-label="Filtros do Catálogo"
      >
        <div className="w-[320px] max-w-[85vw] bg-surface-card border-l border-border h-full p-6 overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside
      className="hidden lg:flex flex-col gap-[24px] w-[310px] shrink-0"
      aria-label="Filtros e Destaque"
    >
      {/* Caixa de Filtros (Figma Node 70485:381) */}
      <div className="w-[310px] bg-surface-card p-[20px] flex flex-col items-start overflow-clip">
        {content}
      </div>

      {/* Featured NFT Banner (Figma Node 70410:3791) */}
      <div className="w-[310px] h-[470px] pt-[24px] pb-[4px] bg-gradient-to-b from-[rgba(210,138,76,0.1)] to-[rgba(210,138,76,0.03)] flex flex-col items-center relative overflow-hidden shrink-0">
        <div className="flex flex-col gap-[16px] items-center w-full z-10 px-[20px]">
          <h4 className="font-mono text-[24px] font-bold leading-[32px] text-text-accent text-center w-full">
            NFT EM DESTAQUE
          </h4>
          <p className="font-mono text-[22px] font-bold leading-[16px] text-foreground text-center w-full">
            OFERTA LIMITADA
          </p>
        </div>

        <div className="h-[368px] w-full rounded-[22px] overflow-hidden mt-3 relative z-10">
          <img
            src="/assets/nfts/sage-nomad.webp"
            alt="NFT em Destaque - Oferta Limitada"
            className="w-full h-full object-cover rounded-[22px] pointer-events-none"
            width={310}
            height={368}
            loading="lazy"
          />
        </div>

        {/* Elementos decorativos fiéis ao Figma */}
        <div className="absolute border-2 border-[#46a358] border-solid left-[16px] opacity-20 rounded-[7px] size-[22px] top-[299px] pointer-events-none" />
        <div
          className="absolute left-[248px] rounded-[29px] size-[45px] top-[343px] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(145.46deg, rgba(210, 138, 76, 0.3) 46.085%, rgba(210, 138, 76, 0) 103.28%)',
          }}
        />
        <div
          className="absolute left-[38px] rounded-[29px] size-[15px] top-[105px] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(145.46deg, rgba(210, 138, 76, 0.3) 46.085%, rgba(210, 138, 76, 0) 103.28%)',
          }}
        />
      </div>
    </aside>
  );
}
