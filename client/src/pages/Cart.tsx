import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Acesso Necessário</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar autenticado para acessar o carrinho.
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()} size="lg">
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  const { data: cartItems, refetch } = trpc.cart.list.useQuery();
  const removeFromCartMutation = trpc.cart.remove.useMutation({
    onSuccess: () => refetch(),
  });
  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => refetch(),
  });

  const total = cartItems?.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || '0');
    return sum + price * item.quantity;
  }, 0) || 0;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 text-foreground hover:text-accent transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Meu Carrinho</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-8">
              Explore nosso catálogo e adicione seus perfumes favoritos
            </p>
            <Button onClick={() => setLocation("/catalogo")} size="lg">
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itens do Carrinho */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-6 flex gap-6">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.imageUrl || ''}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Código: {item.product?.code}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantityMutation.mutate({
                              productId: item.productId,
                              quantity: Math.max(1, item.quantity - 1),
                            })}
                            className="px-3 py-1 border border-border rounded hover:bg-muted transition"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantityMutation.mutate({
                              productId: item.productId,
                              quantity: item.quantity + 1,
                            })}
                            className="px-3 py-1 border border-border rounded hover:bg-muted transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground line-through">
                            R$ {parseFloat(item.product?.price || '0').toFixed(2)}
                          </p>
                          <p className="text-lg font-bold text-accent">
                            R$ {(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCartMutation.mutate({
                            productId: item.productId,
                          })}
                          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Resumo do Carrinho */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Resumo do Pedido</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Frete</span>
                    <span>Grátis</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Desconto</span>
                    <span className="text-green-600">-R$ 0,00</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-foreground mb-6">
                  <span>Total</span>
                  <span className="text-accent">R$ {total.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full mb-3" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  Ir para Checkout
                </Button>

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/catalogo")}
                >
                  Continuar Comprando
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
