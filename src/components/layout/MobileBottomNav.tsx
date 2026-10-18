import { Link } from '@tanstack/react-router';
import {
  MobileHomeIcon,
  MobileShopIcon,
  MobileUserIcon,
  HeartIcon,
} from '@/components/ui/icons';

interface MobileBottomNavProps {
  cartItemCount?: number;
}

export function MobileBottomNav({ cartItemCount = 0 }: MobileBottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[84px] pointer-events-none"
      aria-label="Navegação móvel inferior"
    >
      <div className="relative w-full h-full pointer-events-auto">
        {/* Fundo escuro com sombra */}
        <div className="absolute inset-0 bg-surface-card border-t border-border/60 shadow-[0_-10px_30px_rgba(20,13,10,0.8)]" />

        {/* Itens de Navegação */}
        <div className="relative h-full flex items-center justify-around px-4 pb-2">
          {/* Início */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-1 text-text-accent focus-visible:ring-1 focus-visible:ring-primary rounded p-1"
            aria-label="Início"
          >
            <MobileHomeIcon className="size-6 text-text-accent" />
            <span className="sr-only">Início</span>
          </Link>

          {/* Favoritos */}
          <Link
            to="/favorites"
            className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary rounded p-1"
            aria-label="Favoritos"
          >
            <HeartIcon className="size-6" />
            <span className="sr-only">Favoritos</span>
          </Link>

          {/* Botão Central Elevado com Gradiente Dourado (Figma Ellipse 39) */}
          <div className="-mt-8 relative flex items-center justify-center">
            <button
              type="button"
              className="size-[58px] rounded-full shadow-lg flex items-center justify-center focus-visible:ring-2 focus-visible:ring-foreground transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(180deg, rgba(210, 138, 76, 0.4) 0%, #D28A4C 100%)',
              }}
              aria-label="Explorar mercado"
            >
              <div className="size-7 rounded-md border-2 border-foreground/90 flex items-center justify-center">
                <div className="w-3.5 h-0.5 bg-foreground/90" />
              </div>
            </button>
          </div>

          {/* Carrinho */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary rounded p-1"
            aria-label={`Carrinho de compras com ${cartItemCount} itens`}
          >
            <MobileShopIcon className="size-6 text-text-secondary" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-ink text-[10px] font-bold px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Carrinho</span>
          </Link>

          {/* Perfil */}
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary rounded p-1"
            aria-label="Meu Perfil"
          >
            <MobileUserIcon className="size-6 text-text-secondary" />
            <span className="sr-only">Perfil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
