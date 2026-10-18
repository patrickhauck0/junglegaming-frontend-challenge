import { useEffect } from 'react';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useCart } from '@/hooks/useCart';
import { socketClient } from '@/lib/socket-client';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { data: cart } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    socketClient.connect();
    return () => {
      // Ciclo de vida da aplicação mantém o socket ativo
    };
  }, []);

  const isNftDetails = pathname.startsWith('/nfts/');
  const activeHeaderItem = isNftDetails ? 'market' : 'home';

  return (
    <div className="min-h-screen flex flex-col bg-ink text-foreground font-mono selection:bg-primary/25 selection:text-foreground">
      {/* Região acessível para anúncios em tempo real e mutations */}
      <div
        id="a11y-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Header: visível sempre no desktop; no mobile escondido na tela de detalhes conforme Figma 15:5536 */}
      <div className={isNftDetails ? 'hidden md:block' : 'block'}>
        <Header cartItemCount={cart?.totalItems || 0} activeItem={activeHeaderItem} />
      </div>

      <main className="flex-1 w-full" id="main-content">
        <Outlet />
      </main>

      {/* Footer: visível no desktop e mobile normal; escondido no mobile na tela de detalhes */}
      <div className={isNftDetails ? 'hidden md:block' : 'block'}>
        <Footer />
      </div>

      {/* MobileBottomNav: escondido na tela de detalhes mobile (que possui a Buy Bar própria) */}
      {!isNftDetails && <MobileBottomNav cartItemCount={cart?.totalItems || 0} />}
    </div>
  );
}
