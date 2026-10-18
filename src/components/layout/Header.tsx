import { Link } from '@tanstack/react-router';
import { KurioLogo, SearchIcon, CartIcon } from '@/components/ui/icons';

interface HeaderProps {
  cartItemCount?: number;
  activeItem?: 'home' | 'market' | 'collections' | 'about';
}

export function Header({ cartItemCount = 0, activeItem = 'home' }: HeaderProps) {
  return (
    <header className="w-full bg-ink/95 backdrop-blur-sm border-b border-border/80 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] h-[72px] flex items-center justify-between gap-4">
        {/* Marca KURIO */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center focus-visible:ring-2 focus-visible:ring-primary rounded p-1">
            <KurioLogo className="h-6 w-auto" />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
            <Link
              to="/"
              className={`text-sm tracking-wide transition-colors ${
                activeItem === 'home' ? 'text-primary font-bold' : 'text-text-secondary hover:text-foreground'
              }`}
            >
              Explorar
            </Link>
            <span className="text-sm tracking-wide text-text-secondary/60 cursor-not-allowed">
              Coleções
            </span>
            <span className="text-sm tracking-wide text-text-secondary/60 cursor-not-allowed">
              Artistas
            </span>
            <span className="text-sm tracking-wide text-text-secondary/60 cursor-not-allowed">
              Sobre
            </span>
          </nav>
        </div>

        {/* Busca e Ações */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative hidden sm:block w-48 lg:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar NFTs..."
              className="w-full bg-surface-card border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-text-secondary/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Buscar coleções e NFTs"
            />
          </div>

          {/* Botão do Carrinho */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg bg-surface-card border border-border text-foreground hover:border-border-soft transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Carrinho de compras com ${cartItemCount} itens`}
          >
            <CartIcon className="size-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-ink text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Botão Entrar / Perfil */}
          <Link
            to="/login"
            className="bg-primary hover:bg-primary-hover text-ink font-bold text-xs px-4 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-foreground"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
