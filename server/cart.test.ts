import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Cart Operations", () => {
  const testUserId = 9999;
  const testProductId = 1;

  afterAll(async () => {
    // Limpar dados de teste
    await db.clearCart(testUserId);
  });

  it("should add item to cart", async () => {
    await db.addToCart(testUserId, testProductId, 1);
    const items = await db.getCartItems(testUserId);
    expect(items.length).toBeGreaterThan(0);
    const item = items.find(i => i.productId === testProductId);
    expect(item).toBeDefined();
    expect(item?.quantity).toBe(1);
  });

  it("should increase quantity when adding same product again", async () => {
    await db.clearCart(testUserId);
    await db.addToCart(testUserId, testProductId, 1);
    await db.addToCart(testUserId, testProductId, 2);
    
    const items = await db.getCartItems(testUserId);
    const item = items.find(i => i.productId === testProductId);
    expect(item?.quantity).toBe(3);
  });

  it("should update cart quantity", async () => {
    await db.clearCart(testUserId);
    await db.addToCart(testUserId, testProductId, 1);
    await db.updateCartQuantity(testUserId, testProductId, 5);
    
    const items = await db.getCartItems(testUserId);
    const item = items.find(i => i.productId === testProductId);
    expect(item?.quantity).toBe(5);
  });

  it("should remove item from cart when quantity is 0", async () => {
    await db.clearCart(testUserId);
    await db.addToCart(testUserId, testProductId, 1);
    await db.updateCartQuantity(testUserId, testProductId, 0);
    
    const items = await db.getCartItems(testUserId);
    const item = items.find(i => i.productId === testProductId);
    expect(item).toBeUndefined();
  });

  it("should remove item from cart", async () => {
    await db.clearCart(testUserId);
    await db.addToCart(testUserId, testProductId, 1);
    await db.removeFromCart(testUserId, testProductId);
    
    const items = await db.getCartItems(testUserId);
    expect(items.length).toBe(0);
  });

  it("should clear entire cart", async () => {
    await db.clearCart(testUserId);
    await db.addToCart(testUserId, testProductId, 1);
    await db.addToCart(testUserId, 2, 1);
    
    await db.clearCart(testUserId);
    const items = await db.getCartItems(testUserId);
    expect(items.length).toBe(0);
  });
});
