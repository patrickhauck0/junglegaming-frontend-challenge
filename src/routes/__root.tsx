import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-ink text-foreground font-mono selection:bg-primary/25 selection:text-foreground">
      {/* Região acessível para anúncios em tempo real e mutations */}
      <div
        id="a11y-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <Header />

      <main className="flex-1 w-full" id="main-content">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
