import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Orders Operations", () => {
  const testUserId = 9998;

  it("should create an order with unique code", async () => {
    const orderCode = await db.createOrder(testUserId, 299.90, "pix");
    expect(orderCode).toBeDefined();
    expect(orderCode).toMatch(/^PED-/);
  });

  it("should retrieve order by code", async () => {
    const orderCode = await db.createOrder(testUserId, 299.90, "boleto");
    if (orderCode) {
      const order = await db.getOrderByCode(orderCode);
      expect(order).toBeDefined();
      expect(order?.orderCode).toBe(orderCode);
      expect(order?.userId).toBe(testUserId);
      expect(order?.paymentMethod).toBe("boleto");
    }
  });

  it("should retrieve user orders", async () => {
    await db.createOrder(testUserId, 299.90, "pix");
    const orders = await db.getUserOrders(testUserId);
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });

  it("should add items to order", async () => {
    const orderCode = await db.createOrder(testUserId, 599.80, "cartao");
    if (orderCode) {
      const order = await db.getOrderByCode(orderCode);
      if (order) {
        await db.addOrderItems(order.id, [
          { productId: 1, quantity: 1, priceAtPurchase: 295.00 },
          { productId: 2, quantity: 1, priceAtPurchase: 285.00 },
        ]);

        const items = await db.getOrderItems(order.id);
        expect(items.length).toBe(2);
        expect(items[0].quantity).toBe(1);
      }
    }
  });

  it("should return undefined for non-existent order code", async () => {
    const order = await db.getOrderByCode("INVALID-CODE-12345");
    expect(order).toBeUndefined();
  });
});
