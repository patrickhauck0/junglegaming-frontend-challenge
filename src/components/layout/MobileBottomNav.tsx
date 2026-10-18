import { Link } from '@tanstack/react-router';
import { SearchIcon, CartIcon, HeartIcon, WalletIcon } from '@/components/ui/icons';

interface MobileBottomNavProps {
  cartItemCount?: number;
}

export function MobileBottomNav({ cartItemCount = 0 }: MobileBottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-md border-t border-border flex items-center justify-around h-14 px-2"
      aria-label="Navegação móvel inferior"
    >
      <Link
        to="/"
        className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-primary transition-colors text-[10px]"
        aria-label="Ir para Início"
      >
        <SearchIcon className="size-4" />
        <span>Explorar</span>
      </Link>

      <Link
        to="/cart"
        className="relative flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-primary transition-colors text-[10px]"
        aria-label={`Carrinho de compras com ${cartItemCount} itens`}
      >
        <CartIcon className="size-4" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 right-2 bg-primary text-ink text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
            {cartItemCount}
          </span>
        )}
        <span>Carrinho</span>
      </Link>

      <Link
        to="/favorites"
        className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-primary transition-colors text-[10px]"
        aria-label="Favoritos"
      >
        <HeartIcon className="size-4" />
        <span>Favoritos</span>
      </Link>

      <Link
        to="/profile"
        className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-primary transition-colors text-[10px]"
        aria-label="Minha conta e perfil"
      >
        <WalletIcon className="size-4" />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
