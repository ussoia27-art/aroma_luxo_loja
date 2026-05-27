import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Sparkles, Award } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

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
          <h1 className="text-2xl font-bold text-foreground">Sobre Nós</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-accent to-purple-600 rounded-lg p-12 text-white mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Aroma e Luxo</h2>
          <p className="text-lg">Fragrâncias Premium para Momentos Especiais</p>
        </div>

        {/* Nossa História */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-6">Nossa História</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                A Aroma e Luxo nasceu da paixão por fragrâncias refinadas e da vontade de trazer experiências olfativas premium para o alcance de todos. Desde 2015, nos dedicamos a selecionar os melhores perfumes do mundo, oferecendo uma coleção cuidadosamente curada que reflete elegância, sofisticação e qualidade.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Cada perfume em nossa loja é escolhido por sua excelência, durabilidade e capacidade de criar momentos memoráveis. Acreditamos que uma fragrância perfeita é mais que um aroma – é uma expressão de personalidade e estilo.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nosso compromisso é oferecer não apenas produtos de qualidade, mas também uma experiência de compra excepcional, com atendimento personalizado e entrega rápida.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 text-center">
              <Sparkles className="w-24 h-24 text-accent mx-auto mb-4" />
              <p className="text-foreground font-semibold text-lg">Desde 2015</p>
              <p className="text-muted-foreground">Trazendo luxo e elegância</p>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Missão, Visão e Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 border-accent/20 hover:border-accent transition">
              <Heart className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold text-foreground mb-3">Missão</h4>
              <p className="text-muted-foreground">
                Oferecer fragrâncias premium de qualidade excepcional, proporcionando experiências sensoriais que elevam a autoestima e expressão pessoal de nossos clientes.
              </p>
            </Card>

            <Card className="p-6 border-2 border-accent/20 hover:border-accent transition">
              <Sparkles className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold text-foreground mb-3">Visão</h4>
              <p className="text-muted-foreground">
                Ser a loja de perfumes mais confiável e elegante do Brasil, reconhecida pela qualidade, inovação e excelência no atendimento ao cliente.
              </p>
            </Card>

            <Card className="p-6 border-2 border-accent/20 hover:border-accent transition">
              <Award className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-bold text-foreground mb-3">Valores</h4>
              <p className="text-muted-foreground">
                Qualidade, Integridade, Inovação e Satisfação do Cliente. Comprometidos com a excelência em tudo que fazemos.
              </p>
            </Card>
          </div>
        </section>

        {/* Por que escolher a gente */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Por Que Escolher a Aroma e Luxo?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white">
                  <span className="text-xl font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Seleção Premium</h4>
                <p className="text-muted-foreground">
                  Apenas fragrâncias autênticas e de qualidade garantida, selecionadas por especialistas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white">
                  <span className="text-xl font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Preços Competitivos</h4>
                <p className="text-muted-foreground">
                  Oferecemos as melhores fragrâncias com preços justos e promoções exclusivas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white">
                  <span className="text-xl font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Entrega Rápida</h4>
                <p className="text-muted-foreground">
                  Enviamos seus pedidos com rapidez e segurança para todo o Brasil.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white">
                  <span className="text-xl font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Atendimento Personalizado</h4>
                <p className="text-muted-foreground">
                  Equipe dedicada pronta para ajudar na escolha da fragrância perfeita.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white">
                  <span className="text-xl font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Garantia de Qualidade</h4>
                <p className="text-muted-foreground">
                  Todos os produtos são 100% originais com garantia de autenticidade.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white">
                  <span className="text-xl font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Múltiplas Formas de Pagamento</h4>
                <p className="text-muted-foreground">
                  PIX, Boleto, Cartão de Crédito e outras opções para sua comodidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Nossas Categorias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-foreground mb-2">Floral</h4>
              <p className="text-muted-foreground">Fragrâncias delicadas e femininas com notas florais sofisticadas.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-foreground mb-2">Cítrico</h4>
              <p className="text-muted-foreground">Aromas frescos e energéticos perfeitos para o dia a dia.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-foreground mb-2">Amadeirado</h4>
              <p className="text-muted-foreground">Perfumes sofisticados e elegantes com notas quentes e profundas.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-foreground mb-2">Infantil</h4>
              <p className="text-muted-foreground">Fragrâncias suaves e seguras especialmente desenvolvidas para crianças.</p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-accent to-purple-600 rounded-lg p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para Descobrir Sua Fragrância Perfeita?</h3>
          <p className="text-lg mb-8">Explore nossa coleção exclusiva de perfumes premium</p>
          <Button
            onClick={() => setLocation("/catalogo")}
            className="bg-white text-accent hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg"
          >
            Explorar Catálogo
          </Button>
        </section>
      </div>
    </div>
  );
}
