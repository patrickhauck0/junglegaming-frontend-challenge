import { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
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

  useEffect(() => {
    socketClient.connect();
    return () => {
      // O ciclo de vida da aplicação mantém o socket ativo
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ink text-foreground font-mono selection:bg-primary/25 selection:text-foreground">
      {/* Região acessível para anúncios em tempo real e mutations */}
      <div
        id="a11y-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <Header cartItemCount={cart?.totalItems || 0} activeItem="home" />

      <main className="flex-1 w-full" id="main-content">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav cartItemCount={cart?.totalItems || 0} />
    </div>
  );
}
