import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, cartItems, orders, orderItems, promotions, orderStatusHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== PRODUTOS =====
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.category, category));
}

// ===== CARRINHO =====
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number = 1) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await db.select().from(cartItems).where(
    and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
  ).limit(1);
  
  if (existing.length > 0) {
    // Atualizar quantidade
    await db.update(cartItems).set({ quantity: existing[0].quantity + quantity }).where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
    );
  } else {
    // Adicionar novo item
    await db.insert(cartItems).values({ userId, productId, quantity });
  }
}

export async function removeFromCart(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(
    and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
  );
}

export async function updateCartQuantity(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) return;
  if (quantity <= 0) {
    await removeFromCart(userId, productId);
  } else {
    await db.update(cartItems).set({ quantity }).where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
    );
  }
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ===== PEDIDOS =====
export async function createOrder(userId: number, totalPrice: number, paymentMethod: string) {
  const db = await getDb();
  if (!db) return null;
  
  const orderCode = `PED-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  
  await db.insert(orders).values({
    orderCode,
    userId,
    totalPrice: totalPrice.toString(),
    paymentMethod,
    status: 'pending',
    paymentStatus: 'pending',
  });
  
  return orderCode;
}

export async function addOrderItems(orderId: number, items: { productId: number; quantity: number; priceAtPurchase: number }[]) {
  const db = await getDb();
  if (!db) return;
  
  for (const item of items) {
    await db.insert(orderItems).values({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase.toString(),
    });
  }
}

export async function getOrderByCode(orderCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderCode, orderCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// ===== PROMOÇÕES =====
export async function getActivePromotions() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return await db.select().from(promotions).where(
    and(
      eq(promotions.isActive, true),
      gte(promotions.endDate, now),
      lte(promotions.startDate, now)
    )
  );
}

export async function createPromotion(productId: number, discountPercentage: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return null;
  
  await db.insert(promotions).values({
    productId,
    discountPercentage,
    startDate,
    endDate,
    isActive: true,
  });
}

// Funções de Histórico de Status
export async function addOrderStatusHistory(
  orderId: number,
  status: string,
  description?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(orderStatusHistory).values({
      orderId,
      status: status as any,
      description: description || null,
    });
  } catch (error) {
    console.error("[Database] Failed to add order status history:", error);
    throw error;
  }
}

export async function getOrderStatusHistory(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const history = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderId))
      .orderBy(desc(orderStatusHistory.createdAt));
    return history;
  } catch (error) {
    console.error("[Database] Failed to get order status history:", error);
    return [];
  }
}
