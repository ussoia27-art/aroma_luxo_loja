import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Heart, ArrowLeft, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";

export default function Promotions() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState<string>("00:00:00");

  const { data: promotions = [] } = trpc.promotions.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();
  const addToCartMutation = trpc.cart.add.useMutation();

  // Atualizar countdown a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (promotions.length > 0) {
        const nextPromo = promotions[0];
        const now = new Date().getTime();
        const expiresAt = new Date(nextPromo.endDate).getTime();
        const diff = expiresAt - now;

        if (diff > 0) {
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setCountdown(
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          );
        } else {
          setCountdown("00:00:00");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [promotions]);

  // Mapear produtos com suas promoções
  const productsWithPromo = products.map((product: any) => {
    const promo = promotions.find((p: any) => p.productId === product.id);
    return {
      ...product,
      promotion: promo,
      discountedPrice: promo
        ? (parseFloat(product.price) * (1 - promo.discountPercentage / 100)).toFixed(2)
        : null,
    };
  });

  const promotedProducts = productsWithPromo.filter((p: any) => p.promotion);

  const handleAddToCart = (productId: number, productName: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-foreground hover:text-accent transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Promoções Especiais</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Banner de Promoção */}
        <div className="bg-gradient-to-r from-accent to-purple-600 rounded-lg p-8 mb-12 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-8 h-8" />
            <h2 className="text-4xl font-bold">Ofertas do Dia</h2>
            <Flame className="w-8 h-8" />
          </div>
          <p className="text-lg mb-4">Descontos exclusivos por tempo limitado!</p>
          <div className="text-5xl font-bold font-mono">{countdown}</div>
          <p className="text-sm mt-2">Próxima atualização em</p>
        </div>

        {/* Grid de Produtos em Promoção */}
        {promotedProducts.length > 0 ? (
          <>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              {promotedProducts.length} Produtos em Promoção
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotedProducts.map((product: any) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                  {/* Imagem com Badge de Desconto */}
                  <div className="relative h-64 bg-muted overflow-hidden group">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                    {product.promotion && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                        -{product.promotion.discountPercentage}%
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-accent hover:text-white transition">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">{product.code}</p>
                    <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                    {/* Preço */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-2xl font-bold text-accent">
                          R$ {product.discountedPrice}
                        </p>
                        <p className="text-sm text-muted-foreground line-through">
                          R$ {parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Economia: R${(parseFloat(product.price) - parseFloat(product.discountedPrice)).toFixed(2)}
                      </p>
                    </div>

                    {/* Botão */}
                    <Button
                      onClick={() => handleAddToCart(product.id, product.name)}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Flame className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">Nenhuma promoção ativa no momento.</p>
            <p className="text-sm text-muted-foreground mb-6">Volte em breve para novas ofertas!</p>
            <Button onClick={() => setLocation("/catalogo")} className="bg-accent text-white">
              Explorar Catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
