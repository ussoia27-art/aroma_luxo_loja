import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== PRODUTOS =====
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductsByCategory(input.category);
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),

    filtered: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z.enum(['price_asc', 'price_desc', 'popularity', 'newest']).optional(),
      }))
      .query(async ({ input }) => {
        return await db.getFilteredProducts({
          category: input.category,
          minPrice: input.minPrice,
          maxPrice: input.maxPrice,
          sortBy: input.sortBy,
        });
      }),

    byPriceRange: publicProcedure
      .input(z.object({ minPrice: z.number(), maxPrice: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductsByPriceRange(input.minPrice, input.maxPrice);
      }),

    topProducts: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getTopProducts(input.limit || 10);
      }),
  }),

  // ===== CARRINHO =====
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const items = await db.getCartItems(ctx.user.id);
      // Enriquecer com dados do produto
      const enriched = await Promise.all(
        items.map(async (item) => {
          const product = await db.getProductById(item.productId);
          return { ...item, product };
        })
      );
      return enriched;
    }),

    add: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        await db.addToCart(ctx.user.id, input.productId, input.quantity);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.removeFromCart(ctx.user.id, input.productId);
        return { success: true };
      }),

    updateQuantity: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(0) }))
      .mutation(async ({ input, ctx }) => {
        await db.updateCartQuantity(ctx.user.id, input.productId, input.quantity);
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // ===== PEDIDOS =====
  orders: router({
    create: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().min(1),
          priceAtPurchase: z.number(),
        })),
        totalPrice: z.number(),
        paymentMethod: z.enum(['pix', 'boleto', 'cartao']),
      }))
      .mutation(async ({ input, ctx }) => {
        const orderCode = await db.createOrder(ctx.user.id, input.totalPrice, input.paymentMethod);
        
        if (orderCode) {
          const order = await db.getOrderByCode(orderCode);
          if (order) {
            await db.addOrderItems(order.id, input.items);
            await db.clearCart(ctx.user.id);
          }
        }
        
        return { orderCode, success: !!orderCode };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserOrders(ctx.user.id);
    }),

    byCode: publicProcedure
      .input(z.object({ orderCode: z.string() }))
      .query(async ({ input }) => {
        const order = await db.getOrderByCode(input.orderCode);
        if (!order) return null;
        
        const items = await db.getOrderItems(order.id);
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const product = await db.getProductById(item.productId);
            return { ...item, product };
          })
        );
        
        const statusHistory = await db.getOrderStatusHistory(order.id);
        return { ...order, items: enrichedItems, statusHistory };
      }),

    statusHistory: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrderStatusHistory(input.orderId);
      }),
  }),

  // ===== PROMOÇÕES =====
  promotions: router({
    active: publicProcedure.query(async () => {
      const promos = await db.getActivePromotions();
      // Enriquecer com dados do produto
      const enriched = await Promise.all(
        promos.map(async (promo) => {
          const product = await db.getProductById(promo.productId);
          return { ...promo, product };
        })
      );
      return enriched;
    }),

    list: publicProcedure.query(async () => {
      return await db.getActivePromotions();
    }),
  }),
});

export type AppRouter = typeof appRouter;
