import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation, useSearch } from "wouter";
import { CheckCircle, Copy, Home } from "lucide-react";
import { useState, useEffect } from "react";

export default function OrderConfirmation() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [copied, setCopied] = useState(false);

  const orderCode = new URLSearchParams(search).get('pedido');
  const { data: order } = trpc.orders.byCode.useQuery(
    { orderCode: orderCode || '' },
    { enabled: !!orderCode }
  );

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

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-lg text-muted-foreground mb-4">Pedido não encontrado</p>
          <Button onClick={() => setLocation("/")} size="lg">
            Voltar para Início
          </Button>
        </Card>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPaymentInstructions = () => {
    switch (order.paymentMethod) {
      case 'pix':
        return {
          title: 'Pagamento via PIX',
          instructions: [
            'Escaneie o QR Code abaixo ou copie a chave PIX',
            'Abra seu aplicativo bancário',
            'Selecione a opção PIX e escolha "Escanear QR Code" ou "Copiar e Colar"',
            'Cole a chave PIX e confirme o pagamento',
            'Seu pedido será confirmado automaticamente após o pagamento'
          ],
          qrCode: 'https://via.placeholder.com/200?text=QR+Code+PIX',
          pixKey: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000520400005303986540510.005802BR5913Fulano de Tal6009BRASILIA62410503***63041D3A'
        };
      case 'boleto':
        return {
          title: 'Pagamento via Boleto',
          instructions: [
            'Seu boleto foi gerado e será enviado por email',
            'Você pode visualizar e imprimir o boleto',
            'Pague o boleto em qualquer banco ou lotérica',
            'Prazo de vencimento: 3 dias úteis',
            'Seu pedido será confirmado após a compensação do boleto'
          ],
          boletoNumber: '12345.67890 12345.678901 12345.678901 1 12345678901234'
        };
      case 'cartao':
        return {
          title: 'Pagamento via Cartão de Crédito',
          instructions: [
            'Seu pagamento foi processado com sucesso',
            'Você receberá uma confirmação por email',
            'Seu pedido será enviado em breve',
            'Você pode acompanhar o status do pedido usando o código acima',
            'Parcelamento em até 12x sem juros'
          ]
        };
      default:
        return { title: 'Pagamento', instructions: [] };
    }
  };

  const paymentInfo = getPaymentInstructions();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div></div>
          <h1 className="text-2xl font-bold text-foreground">Confirmação de Pedido</h1>
          <button 
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-muted rounded transition"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-2">Pedido Confirmado!</h2>
          <p className="text-lg text-muted-foreground">
            Seu pedido foi criado com sucesso. Agora siga as instruções de pagamento abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Código do Pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Código do Pedido</h3>
              <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 mb-4">
                <p className="text-2xl font-mono font-bold text-accent text-center break-all">
                  {order.orderCode}
                </p>
              </div>
              <Button 
                className="w-full mb-4"
                onClick={handleCopyCode}
                variant={copied ? 'default' : 'outline'}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copiado!' : 'Copiar Código'}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">💡 Dica:</p>
                <p>Guarde este código para rastrear seu pedido</p>
              </div>
            </Card>
          </div>

          {/* Instruções de Pagamento */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">{paymentInfo.title}</h3>

              {order.paymentMethod === 'pix' && (
                <div className="mb-8">
                  <div className="bg-muted rounded-lg p-8 mb-6 flex items-center justify-center">
                    <img 
                      src={paymentInfo.qrCode} 
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Ou copie a chave PIX:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={paymentInfo.pixKey} 
                      readOnly 
                      className="flex-grow px-3 py-2 border border-border rounded bg-muted text-sm"
                    />
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentInfo.pixKey || '');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {order.paymentMethod === 'boleto' && (
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Número do Boleto:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={paymentInfo.boletoNumber} 
                      readOnly 
                      className="flex-grow px-3 py-2 border border-border rounded bg-muted text-sm font-mono"
                    />
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentInfo.boletoNumber || '');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <h4 className="font-bold text-foreground mb-4">Instruções:</h4>
              <ol className="space-y-3 mb-8">
                {paymentInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-foreground">
                    <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">✓ Status:</span> Aguardando pagamento
                </p>
              </div>
            </Card>

            {/* Resumo do Pedido */}
            <Card className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Resumo do Pedido</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-foreground">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span className="font-semibold">
                      R$ {(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xl font-bold text-foreground mb-6">
                <span>Total</span>
                <span className="text-accent">R$ {parseFloat(order.totalPrice).toFixed(2)}</span>
              </div>

              <Button 
                className="w-full mb-3"
                onClick={() => setLocation("/rastreamento")}
              >
                Rastrear Pedido
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/")}
              >
                Voltar para Início
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
