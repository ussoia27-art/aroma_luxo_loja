import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto' | 'cartao'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartItems } = trpc.cart.list.useQuery();
  const createOrderMutation = trpc.orders.create.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-lg text-muted-foreground mb-4">Você precisa estar autenticado</p>
          <Button onClick={() => setLocation("/")} size="lg">
            Voltar para Início
          </Button>
        </Card>
      </div>
    );
  }

  const total = cartItems?.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || '0');
    return sum + price * item.quantity;
  }, 0) || 0;

  const handleConfirmOrder = async () => {
    if (!cartItems || cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await createOrderMutation.mutateAsync({
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: parseFloat(item.product?.price || '0'),
        })),
        totalPrice: total,
        paymentMethod,
      });

      if (result.success && result.orderCode) {
        setLocation(`/confirmacao?pedido=${result.orderCode}`);
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/carrinho")} className="flex items-center gap-2 text-foreground hover:text-accent transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">Forma de Pagamento</h2>

              <div className="space-y-4">
                {/* PIX */}
                <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition" style={{ borderColor: paymentMethod === 'pix' ? 'var(--accent)' : undefined }}>
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="font-bold text-foreground">PIX</p>
                    <p className="text-sm text-muted-foreground">Pagamento instantâneo via PIX</p>
                  </div>
                  {paymentMethod === 'pix' && <Check className="w-5 h-5 text-accent" />}
                </label>

                {/* Boleto */}
                <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition" style={{ borderColor: paymentMethod === 'boleto' ? 'var(--accent)' : undefined }}>
                  <input
                    type="radio"
                    name="payment"
                    value="boleto"
                    checked={paymentMethod === 'boleto'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="font-bold text-foreground">Boleto Bancário</p>
                    <p className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</p>
                  </div>
                  {paymentMethod === 'boleto' && <Check className="w-5 h-5 text-accent" />}
                </label>

                {/* Cartão de Crédito */}
                <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-accent transition" style={{ borderColor: paymentMethod === 'cartao' ? 'var(--accent)' : undefined }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cartao"
                    checked={paymentMethod === 'cartao'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="font-bold text-foreground">Cartão de Crédito</p>
                    <p className="text-sm text-muted-foreground">Parcelamento disponível</p>
                  </div>
                  {paymentMethod === 'cartao' && <Check className="w-5 h-5 text-accent" />}
                </label>
              </div>
            </Card>

            {/* Informações de Entrega */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">Endereço de Entrega</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  ℹ️ Endereço será confirmado após o pagamento ser processado
                </p>
              </div>
              <p className="text-muted-foreground">
                Você será redirecionado para confirmar o endereço de entrega após selecionar a forma de pagamento.
              </p>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Resumo do Pedido</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-96 overflow-y-auto">
                {cartItems?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.product?.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-foreground">
                      R$ {(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-foreground mb-6">
                <span>Total</span>
                <span className="text-accent">R$ {total.toFixed(2)}</span>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleConfirmOrder}
                disabled={isProcessing || !cartItems || cartItems.length === 0}
              >
                {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
              </Button>

              <Button 
                variant="outline"
                className="w-full mt-3"
                onClick={() => setLocation("/carrinho")}
              >
                Voltar ao Carrinho
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
