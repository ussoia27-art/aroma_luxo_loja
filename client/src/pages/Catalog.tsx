import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

const CATEGORIES = ["Floral", "Citrico", "Amadeirado", "Infantil"];

export default function Catalog() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products } = trpc.products.list.useQuery();
  const addToCartMutation = trpc.cart.add.useMutation();

  const filteredProducts = selectedCategory
    ? products?.filter(p => p.category === selectedCategory)
    : products;

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
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 text-foreground hover:text-accent transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Catálogo de Perfumes</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-border shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Categorias</h3>
              
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
                  selectedCategory === null
                    ? "bg-accent text-white"
                    : "bg-muted text-foreground hover:bg-secondary"
                }`}
              >
                Todos os Produtos
              </button>

              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
                    selectedCategory === category
                      ? "bg-accent text-white"
                      : "bg-muted text-foreground hover:bg-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedCategory ? `${selectedCategory}` : "Todos os Produtos"}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts?.length || 0} produtos disponíveis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-elegant-hover transition flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl || ''}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition">
                      <Heart className="w-5 h-5 text-foreground" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-foreground">
                      Código: {product.code}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-xs text-accent font-semibold mb-2">{product.category}</p>
                    <h4 className="text-lg font-bold text-foreground mb-2">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <p className="text-2xl font-bold text-accent">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={addToCartMutation.isPending}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {(!filteredProducts || filteredProducts.length === 0) && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">Nenhum produto encontrado</p>
                <Button onClick={() => setSelectedCategory(null)}>
                  Ver Todos os Produtos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
