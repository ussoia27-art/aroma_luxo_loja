import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Heart, ArrowLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";

const CATEGORIES = ["Floral", "Citrico", "Amadeirado", "Infantil"];
const SORT_OPTIONS = [
  { value: "newest", label: "Mais Recentes" },
  { value: "popularity", label: "Mais Populares" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
];

export default function Catalog() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popularity" | "price_asc" | "price_desc">("newest");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [showFilters, setShowFilters] = useState(false);

  // Usar a API de filtro avançado
  const { data: filteredProducts = [], isLoading } = trpc.products.filtered.useQuery({
    category: selectedCategory || undefined,
    minPrice: minPrice,
    maxPrice: maxPrice,
    sortBy: sortBy,
  });

  const addToCartMutation = trpc.cart.add.useMutation();

  const handleAddToCart = (productId: number, productName: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setMinPrice(0);
    setMaxPrice(500);
    setSortBy("newest");
  };

  const handleMinPriceChange = (value: number) => {
    if (value <= maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (value: number) => {
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  };

  const hasActiveFilters = selectedCategory || minPrice > 0 || maxPrice < 500;

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
            {/* Mobile Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-4 px-4 py-3 bg-accent text-white rounded-lg font-semibold flex items-center justify-between"
            >
              Filtros
              <ChevronDown className={`w-5 h-5 transition ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Filters Container */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block bg-white rounded-lg p-6 border border-border shadow-sm sticky top-24`}>
              {/* Categorias */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Categorias</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
                    selectedCategory === null ? "bg-accent text-white" : "bg-muted text-foreground hover:bg-secondary"
                  }`}
                >
                  Todas as Categorias
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
                      selectedCategory === cat ? "bg-accent text-white" : "bg-muted text-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Faixa de Preço */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Faixa de Preço</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Mínimo: R$ {minPrice.toFixed(2)}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={minPrice}
                      onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Máximo: R$ {maxPrice.toFixed(2)}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={maxPrice}
                      onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Limpar Filtros */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Ordenação */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {filteredProducts.length} Produtos
              </h2>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-foreground">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando produtos...</p>
                </div>
              </div>
            )}

            {/* Grid de Produtos */}
            {!isLoading && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                    {/* Imagem */}
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
                        <p className="text-2xl font-bold text-accent">R$ {parseFloat(product.price).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Popularidade: {product.popularity} vendas</p>
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
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Nenhum produto encontrado com os filtros selecionados.</p>
                <Button onClick={handleClearFilters} className="mt-4 bg-accent text-white">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
