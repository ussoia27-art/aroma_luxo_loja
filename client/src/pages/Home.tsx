import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Sparkles, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useTimeLeft();

  const { data: products } = trpc.products.list.useQuery();
  const { data: promotions } = trpc.promotions.active.useQuery();
  const addToCartMutation = trpc.cart.add.useMutation();

  const handleAddToCart = (productId: number, productName: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Aroma e Luxo</h1>
          </div>
          
          <nav className="hidden md:flex gap-8 items-center">
            <a href="/" className="text-foreground hover:text-accent transition">Início</a>
            <a href="/catalogo" className="text-foreground hover:text-accent transition">Catálogo</a>
            <a href="/promocoes" className="text-foreground hover:text-accent transition">Promoções</a>
            <a href="/sobre" className="text-foreground hover:text-accent transition">Sobre</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/carrinho" className="relative">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-accent transition" />
            </a>
            {isAuthenticated ? (
              <div className="text-sm text-foreground">Olá, {user?.name}</div>
            ) : (
              <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-accent to-accent/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Fragrâncias de Luxo</h2>
          <p className="text-xl mb-8 opacity-90">Descubra nossa coleção exclusiva de perfumes premium</p>
          <Button size="lg" className="bg-white text-accent hover:bg-gray-100" onClick={() => setLocation("/catalogo")}>
            Explorar Catálogo
          </Button>
        </div>
      </section>

      {/* Promoções Banner */}
      {promotions && promotions.length > 0 && (
        <section className="bg-secondary/10 py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-2">🔥 Ofertas do Dia</h3>
                <p className="text-muted-foreground">Descontos exclusivos por tempo limitado</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-accent">{timeLeft}</div>
                <p className="text-sm text-muted-foreground">Próxima atualização</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotions.slice(0, 3).map((promo) => (
                <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition">
                  <div className="relative">
                    <img 
                      src={promo.product?.imageUrl || ''} 
                      alt={promo.product?.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{promo.discountPercentage}%
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-foreground mb-2">{promo.product?.name}</h4>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground line-through">
                          R$ {parseFloat(promo.product?.price || '0').toFixed(2)}
                        </p>
                        <p className="text-xl font-bold text-accent">
                          R$ {(parseFloat(promo.product?.price || '0') * (1 - promo.discountPercentage / 100)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleAddToCart(promo.productId, promo.product?.name || '')}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-foreground mb-12 text-center">Destaques da Coleção</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-elegant-hover transition">
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img 
                    src={product.imageUrl || ''} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition">
                    <Heart className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-xs text-accent font-semibold mb-2">{product.category}</p>
                  <h4 className="text-xl font-bold text-foreground mb-2">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-accent">R$ {parseFloat(product.price).toFixed(2)}</p>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(product.id, product.name)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => setLocation("/catalogo")}>
              Ver Todos os Produtos
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Fragrâncias Exclusivas Aguardam</h3>
          <p className="text-lg mb-8 opacity-90">Explore nossa coleção completa e encontre o aroma perfeito para você</p>
          <Button size="lg" className="bg-white text-accent hover:bg-gray-100" onClick={() => setLocation("/catalogo")}>
            Descobrir Mais
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Aroma e Luxo</h4>
              <p className="text-sm opacity-75">Fragrâncias exclusivas e de alta qualidade</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navegação</h4>
              <ul className="text-sm opacity-75 space-y-2">
                <li><a href="/" className="hover:opacity-100">Início</a></li>
                <li><a href="/catalogo" className="hover:opacity-100">Catálogo</a></li>
                <li><a href="/sobre" className="hover:opacity-100">Sobre Nós</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="text-sm opacity-75 space-y-2">
                <li><a href="/contato" className="hover:opacity-100">Contato</a></li>
                <li><a href="/rastreamento" className="hover:opacity-100">Rastrear Pedido</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <p className="text-sm opacity-75">
                Email: contato@aromaluxo.com<br/>
                Tel: (31) 9999-9999
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2026 Aroma e Luxo - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function useTimeLeft() {
  const [timeLeft, setTimeLeft] = useState("24:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return [timeLeft, setTimeLeft] as const;
}
