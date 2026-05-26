import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Search, Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const STATUS_CONFIG = {
  pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-600' },
  confirmed: { label: 'Confirmado', icon: CheckCircle, color: 'text-blue-600' },
  shipped: { label: 'Enviado', icon: Truck, color: 'text-purple-600' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { label: 'Cancelado', icon: Clock, color: 'text-red-600' },
};

export default function TrackOrder() {
  const [, setLocation] = useLocation();
  const [orderCode, setOrderCode] = useState('');
  const [searched, setSearched] = useState(false);

  const { data: order, isLoading } = trpc.orders.byCode.useQuery(
    { orderCode },
    { enabled: searched && !!orderCode }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim()) {
      setSearched(true);
    }
  };

  const getStatusSteps = () => {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order?.status as any);
    return statuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
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
          <h1 className="text-2xl font-bold text-foreground">Rastrear Pedido</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Formulário de Busca */}
        <Card className="p-8 mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Buscar Seu Pedido</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              placeholder="Digite o código do pedido (ex: PED-1234567890-ABC123)"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="flex-grow px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button type="submit" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Rastrear
            </Button>
          </form>
        </Card>

        {/* Resultado da Busca */}
        {searched && (
          <div className="max-w-2xl mx-auto">
            {isLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Buscando pedido...</p>
              </Card>
            ) : !order ? (
              <Card className="p-8 text-center border-red-200 bg-red-50">
                <Package className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-600 mb-2">Pedido não encontrado</h3>
                <p className="text-red-600 mb-4">
                  Verifique se o código do pedido está correto e tente novamente.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setOrderCode('');
                    setSearched(false);
                  }}
                >
                  Nova Busca
                </Button>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Informações do Pedido */}
                <Card className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Código do Pedido</p>
                      <p className="text-2xl font-mono font-bold text-accent">{order.orderCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Data do Pedido</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                      <p className="text-2xl font-bold text-accent">R$ {parseFloat(order.totalPrice).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                      <p className="text-lg font-semibold text-foreground capitalize">
                        {order.paymentMethod === 'pix' ? 'PIX' : order.paymentMethod === 'boleto' ? 'Boleto' : 'Cartão de Crédito'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground mb-3">Status do Pagamento</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        order.paymentStatus === 'confirmed' ? 'bg-green-600' :
                        order.paymentStatus === 'failed' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}></div>
                      <span className="font-semibold text-foreground capitalize">
                        {order.paymentStatus === 'confirmed' ? 'Confirmado' :
                         order.paymentStatus === 'failed' ? 'Falhou' :
                         'Pendente'}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Timeline de Status */}
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-8">Status do Envio</h3>
                  
                  <div className="space-y-6">
                    {getStatusSteps().map((step, index) => {
                      const config = STATUS_CONFIG[step.status as keyof typeof STATUS_CONFIG];
                      const Icon = config.icon;

                      return (
                        <div key={step.status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-accent text-white' :
                              step.current ? 'bg-accent text-white ring-4 ring-accent/30' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            {index < getStatusSteps().length - 1 && (
                              <div className={`w-1 h-12 my-2 ${
                                step.completed ? 'bg-accent' : 'bg-muted'
                              }`}></div>
                            )}
                          </div>

                          <div className="flex-grow pb-6">
                            <p className={`font-semibold ${
                              step.current ? 'text-accent' :
                              step.completed ? 'text-foreground' :
                              'text-muted-foreground'
                            }`}>
                              {config.label}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.current ? 'Seu pedido está nesta etapa' :
                               step.completed ? 'Concluído' :
                               'Aguardando'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Itens do Pedido */}
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Itens do Pedido</h3>
                  
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.imageUrl || ''}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-foreground">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            R$ {(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            R$ {parseFloat(item.priceAtPurchase).toFixed(2)} cada
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="text-center">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setOrderCode('');
                      setSearched(false);
                    }}
                  >
                    Rastrear Outro Pedido
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Digite o código do seu pedido para acompanhar o status
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
