import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Products API", () => {
  it("should retrieve all products", async () => {
    const products = await db.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("should retrieve products by category", async () => {
    const floralProducts = await db.getProductsByCategory("Floral");
    expect(Array.isArray(floralProducts)).toBe(true);
    expect(floralProducts.length).toBeGreaterThan(0);
    floralProducts.forEach(product => {
      expect(product.category).toBe("Floral");
    });
  });

  it("should retrieve a product by ID", async () => {
    const products = await db.getAllProducts();
    if (products.length > 0) {
      const product = await db.getProductById(products[0].id);
      expect(product).toBeDefined();
      expect(product?.id).toBe(products[0].id);
      expect(product?.name).toBeDefined();
      expect(product?.price).toBeDefined();
    }
  });

  it("should return undefined for non-existent product", async () => {
    const product = await db.getProductById(99999);
    expect(product).toBeUndefined();
  });
});
