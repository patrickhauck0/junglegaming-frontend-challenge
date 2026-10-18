import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { openLoginModal } from '@/hooks/useAuthModal';
import {
  KurioLogo,
  SearchIcon,
  CartIcon,
  LogoutIcon,
  CloseIcon,
  HeartIcon,
  WalletIcon,
} from '@/components/ui/icons';
import { Button, Input } from '@/components/ui';

interface HeaderProps {
  cartItemCount?: number;
  activeItem?: 'home' | 'market' | 'creators' | 'learn';
}

export function Header({ cartItemCount = 0, activeItem = 'home' }: HeaderProps) {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({
        to: '/',
        search: (prev: Record<string, unknown>) => ({ ...prev, search: query.trim(), page: 1 }),
      });
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-ink border-b border-border sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] h-[72px] flex items-center justify-between relative">
        {/* Marca KURIO (Figma Node I70522:3240;70504:3015;70486:509) */}
        <Link
          to="/"
          className="flex items-center focus-visible:ring-2 focus-visible:ring-primary rounded p-1 shrink-0"
          aria-label="Página inicial Kurio"
        >
          <KurioLogo className="h-[20px] w-auto" />
        </Link>

        {/* Navegação Desktop Centralizada (Figma Node I70522:3240;70504:3015;70486:511) */}
        <nav
          className="hidden md:flex items-center gap-[40px] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          aria-label="Navegação principal"
        >
          {/* Início com Active Underline */}
          <div className="flex flex-col items-center relative py-1">
            <Link
              to="/"
              className={`font-mono text-[16px] leading-normal transition-colors ${
                activeItem === 'home'
                  ? 'font-bold text-text-accent'
                  : 'font-normal text-foreground hover:text-text-accent'
              }`}
            >
              Início
            </Link>
            {activeItem === 'home' && (
              <div className="absolute -bottom-2 w-[58px] h-[2px] bg-text-accent rounded-full" />
            )}
          </div>

          <Link
            to="/"
            search={{ tab: 'all' }}
            className={`font-mono text-[16px] leading-normal transition-colors ${
              activeItem === 'market'
                ? 'font-bold text-text-accent'
                : 'font-normal text-foreground hover:text-text-accent'
            }`}
          >
            Mercado
          </Link>

          <span className="font-mono text-[16px] leading-normal text-foreground/70 cursor-not-allowed select-none">
            Criadores
          </span>

          <span className="font-mono text-[16px] leading-normal text-foreground/70 cursor-not-allowed select-none">
            Aprenda
          </span>
        </nav>

        {/* Busca Expansível & Ações à Direita (Figma Node I70522:3240;70504:3015;70486:518) */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          {/* Lupa / Busca Interativa */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 flex items-center bg-surface-card border border-primary/60 rounded-[6px] px-3 py-1.5 shadow-xl w-[240px] sm:w-[280px] z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <SearchIcon className="size-4 text-text-accent mr-2 shrink-0" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar NFTs..."
                  className="bg-transparent font-mono text-[14px] text-foreground placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-0 border-0 p-0 h-auto w-full shadow-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                  className="size-5 p-0 text-text-secondary hover:text-foreground h-auto"
                  aria-label="Fechar busca"
                >
                  <CloseIcon className="size-4" />
                </Button>
              </form>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="size-[20px] flex items-center justify-center text-foreground hover:text-text-accent transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded cursor-pointer p-0 h-auto"
                aria-label="Abrir campo de busca de NFTs"
              >
                <SearchIcon className="size-[20px]" />
              </Button>
            )}
          </div>

          {/* Carrinho de Compras com Badge (Figma: Cart Icon w:24, Badge size:16 text:10) */}
          <Link
            to="/cart"
            className="relative size-[24px] flex items-center justify-center text-foreground hover:text-text-accent transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={`Carrinho de compras com ${cartItemCount} itens`}
          >
            <CartIcon className="size-[24px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 size-[16px] rounded-full bg-primary text-ink font-mono font-medium text-[10px] flex items-center justify-center shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Usuário Autenticado ou Botão Entrar */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="size-[35px] rounded-[6px] bg-surface-card border border-border hover:border-primary transition-colors flex items-center justify-center overflow-hidden shrink-0"
                aria-label="Ir para perfil do colecionador"
                title={user.name || user.username || 'Perfil'}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.username}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>

              <Link
                to="/favorites"
                className="size-[35px] rounded-[6px] bg-surface-card border border-border hover:border-primary flex items-center justify-center text-foreground hover:text-text-accent transition-colors"
                aria-label="Ver NFTs favoritos"
              >
                <HeartIcon className="size-4" />
              </Link>

              <Link
                to="/wallets"
                className="size-[35px] rounded-[6px] bg-surface-card border border-border hover:border-primary flex items-center justify-center text-foreground hover:text-text-accent transition-colors"
                aria-label="Ver carteiras cadastradas"
              >
                <WalletIcon className="size-4" />
              </Link>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  await logout();
                  navigate({ to: '/' });
                }}
                className="h-[35px] px-2.5 rounded-[6px] bg-surface-raised border border-border hover:border-red-500/50 hover:text-red-400 text-secondary font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label="Sair da conta"
              >
                <LogoutIcon className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                openLoginModal();
              }}
              className="w-[100px] h-[35px] bg-primary hover:brightness-110 active:scale-95 text-ink font-mono font-medium text-[16px] rounded-[6px] flex items-center justify-center gap-[4px] transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer"
            >
              <LogoutIcon className="size-[20px]" />
              <span>Entrar</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
