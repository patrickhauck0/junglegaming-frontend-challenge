import { useEffect } from 'react';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { LoginModal } from '@/components/auth/LoginModal';
import { useLoginModal } from '@/hooks/useAuthModal';
import { useCart } from '@/hooks/useCart';
import { socketClient } from '@/lib/socket-client';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { data: cart } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isOpen, close, redirectUrl } = useLoginModal();

  useEffect(() => {
    socketClient.connect();
    return () => {
      // Ciclo de vida da aplicação mantém o socket ativo
    };
  }, []);

  const isNftDetails = pathname.startsWith('/nfts/');
  const isCart = pathname === '/cart';
  const isPayment = pathname === '/payment';
  const isOrders = pathname.startsWith('/orders');
  const isAuth = pathname === '/login' || pathname === '/register';
  const hideMobileNav = isNftDetails || isCart || isPayment || isOrders || isAuth;
  const activeHeaderItem = isNftDetails || isCart || isPayment || isOrders ? 'market' : 'home';

  return (
    <div className="min-h-screen flex flex-col bg-ink text-foreground font-mono selection:bg-primary/25 selection:text-foreground">
      {/* Modal Global de Login (sobrepõe qualquer tela sem sair da rota) */}
      <LoginModal isOpen={isOpen} onClose={close} redirectUrl={redirectUrl} />

      {/* Região acessível para anúncios em tempo real e mutations */}
      <div
        id="a11y-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Header: visível sempre no desktop; no mobile escondido na tela de detalhes e carrinho conforme Figma */}
      <div className={hideMobileNav ? 'hidden md:block' : 'block'}>
        <Header cartItemCount={cart?.totalItems || 0} activeItem={activeHeaderItem} />
      </div>

      <main className="flex-1 w-full" id="main-content">
        <Outlet />
      </main>

      {/* Footer: visível no desktop e mobile normal; escondido no mobile na tela de detalhes e carrinho */}
      <div className={hideMobileNav ? 'hidden md:block' : 'block'}>
        <Footer />
      </div>

      {/* MobileBottomNav: escondido quando a tela mobile possui barra própria */}
      {!hideMobileNav && <MobileBottomNav cartItemCount={cart?.totalItems || 0} />}
    </div>
  );
}
