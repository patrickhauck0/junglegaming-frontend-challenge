import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/orders/$id')({
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { id } = Route.useParams();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-8">
      <h1 className="text-2xl font-bold text-foreground mb-4">Confirmação de Pedido</h1>
      <p className="text-sm text-text-secondary">
        Recibo e snapshot do pedido #{id}.
      </p>
    </div>
  );
}
