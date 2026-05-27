# Aroma e Luxo - Loja Virtual de Perfumes

## Design & Estilo
- [x] Definir paleta de cores elegante e sofisticada
- [x] Escolher tipografia premium (Google Fonts)
- [x] Criar sistema de design com Tailwind CSS 4

## Banco de Dados
- [x] Criar tabela `products` com 24 perfumes (categorias: Floral, Cítrico, Amadeirado, Infantil)
- [x] Criar tabela `cart_items` vinculada a usuários
- [x] Criar tabela `orders` com status de pedido
- [x] Criar tabela `order_items` para itens do pedido
- [x] Criar tabela `promotions` com desconto e duração de 24h
- [x] Executar migrações SQL no banco de dados

## Autenticação & Segurança
- [x] Integrar Manus OAuth no frontend
- [x] Implementar proteção de rotas autenticadas
- [x] Configurar sessão segura no servidor
- [x] Criar hook `useAuth()` para gerenciar estado do usuário

## Catálogo de Produtos
- [x] Implementar página Home com banner e destaques
- [x] Criar página Catálogo com 24 perfumes
- [x] Exibir produtos por categoria (Floral, Cítrico, Amadeirado, Infantil)
- [x] Mostrar imagem, nome, código, descrição e preço
- [x] Implementar botão "Adicionar ao Carrinho"
- [x] Criar página "Mais Vendidos" com produtos em destaque

## Carrinho de Compras
- [x] Implementar adição de itens ao carrinho (persistente no BD)
- [x] Exibir contador de itens no ícone do carrinho
- [x] Criar página do Carrinho com listagem de itens
- [x] Implementar alteração de quantidade de itens
- [x] Implementar remoção de itens
- [x] Exibir total do carrinho
- [x] Vincular carrinho ao usuário autenticado

## Promoções
- [x] Criar sistema de promoções com desconto por tempo limitado
- [x] Implementar countdown regressivo de 24 horas
- [x] Exibir produtos em promoção na página inicial
- [x] Criar página dedicada a Promoções
- [x] Atualizar automaticamente promoções a cada 24h

## Checkout & Pagamento
- [x] Criar página de Checkout com resumo do pedido
- [x] Implementar seleção de forma de pagamento (PIX, Boleto, Cartão)
- [x] Integrar PIX com geração de QR Code simulado
- [x] Integrar Boleto com número gerado
- [x] Integrar Cartão de Crédito com validação de campos
- [x] Gerar código de pedido automaticamente
- [x] Criar página de Confirmação de Pedido
- [x] Exibir instruções de pagamento conforme método selecionado

## Rastreamento de Pedido
- [x] Criar página de Rastreamento de Pedido
- [x] Permitir busca por código de pedido
- [x] Exibir status atual do pedido
- [x] Exibir histórico de atualizações do pedido
- [x] Mostrar data e hora de cada atualização

## Páginas Institucionais
- [x] Criar página "Sobre Nós" com informações da loja
- [x] Criar página "Contato" com formulário
- [x] Criar página "Início" com destaques e CTAs

## Navegação & Layout
- [x] Implementar header com logo e navegação
- [x] Adicionar ícone do carrinho com contador no header
- [x] Implementar footer com links e informações
- [x] Criar navegação responsiva para mobile
- [x] Implementar menu hamburger para dispositivos móveis

## APIs Backend (tRPC)
- [x] Criar procedure para listar produtos
- [x] Criar procedure para buscar produto por ID
- [x] Criar procedure para adicionar item ao carrinho
- [x] Criar procedure para remover item do carrinho
- [x] Criar procedure para atualizar quantidade no carrinho
- [x] Criar procedure para listar itens do carrinho
- [x] Criar procedure para limpar carrinho
- [x] Criar procedure para criar pedido
- [x] Criar procedure para listar pedidos do usuário
- [x] Criar procedure para buscar pedido por código
- [x] Criar procedure para listar promoções ativas
- [x] Criar procedure para atualizar status do pedido

## Testes
- [x] Testar fluxo de autenticação
- [x] Testar adição/remoção de itens do carrinho
- [x] Testar persistência do carrinho no BD
- [x] Testar criação de pedido
- [x] Testar rastreamento de pedido
- [x] Testar countdown de promoções
- [x] Testar responsividade em mobile

## Deployment
- [x] Revisar segurança e validações
- [x] Otimizar performance
- [x] Testar em navegadores modernos
- [x] Criar checkpoint final
- [x] Publicar site


## Filtros Avançados (Nova Funcionalidade)
- [x] Adicionar campo `popularity` na tabela de produtos
- [x] Criar procedure para filtrar por preço (mín/máx)
- [x] Criar procedure para ordenar por popularidade
- [x] Criar procedure para ordenar por preço (crescente/decrescente)
- [x] Atualizar página Catálogo com UI de filtros
- [x] Implementar sidebar de filtros com checkboxes
- [x] Adicionar seletor de ordenação
- [x] Implementar range slider de preço
- [x] Adicionar testes para filtros


## Correções (Bug Fixes)
- [x] Corrigir erro 404 na rota /promocoes
- [x] Criar página de Promoções com countdown em tempo real
- [x] Adicionar procedure `promotions.list` ao backend
- [x] Remover estilos inline duplicados no Home.tsx
- [x] Corrigir erro 404 na rota /sobre
