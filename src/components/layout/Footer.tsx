import { KurioLogo } from '@/components/ui/icons';

export function Footer() {
  return (
    <footer className="w-full bg-ink border-t border-border mt-20 pb-16 md:pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1: Marca e Missão */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <KurioLogo className="h-6 w-auto" />
            <p className="text-xs text-text-secondary leading-relaxed">
              Marketplace de NFTs GreenMint focado em sustentabilidade, curadoria de arte digital e colecionáveis raros.
            </p>
          </div>

          {/* Coluna 2: Mercado */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Mercado</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Arte digital</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Colecionáveis</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Fotografia</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Música</span>
          </div>

          {/* Coluna 3: Minha Conta */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Conta</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Perfil do colecionador</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Carteiras</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Favoritos</span>
            <span className="text-xs text-text-secondary hover:text-foreground cursor-pointer">Histórico de compras</span>
          </div>

          {/* Coluna 4: Carteiras Compatíveis */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Carteiras compatíveis
            </span>
            <div className="bg-surface-dark border border-border-soft rounded-md px-3 py-2 text-[10px] text-text-accent font-bold tracking-wider text-center">
              METAMASK • WALLETCONNECT • COINBASE
            </div>
            <p className="text-[11px] text-text-secondary">
              Transações em redes verdes com compensação de carbono.
            </p>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-border/40 pt-6 text-center">
          <p className="text-xs text-text-secondary">
            © 2026 Kurio. Propriedade digital para todos.
          </p>
        </div>
      </div>
    </footer>
  );
}
