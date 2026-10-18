import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Entrar na Kurio</h1>
      <p className="text-sm text-text-secondary">Estrutura pronta para a implementação visual de login.</p>
    </div>
  );
}
