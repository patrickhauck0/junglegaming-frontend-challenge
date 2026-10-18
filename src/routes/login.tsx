import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { LoginModal } from '@/components/auth/LoginModal';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-ink flex items-center justify-center">
      <LoginModal
        isOpen={true}
        onClose={() => navigate({ to: search.redirect || '/' })}
        redirectUrl={search.redirect}
      />
    </div>
  );
}
