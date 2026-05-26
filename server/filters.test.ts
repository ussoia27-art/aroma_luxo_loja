import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Product Filters", () => {
  it("should filter products by price range", async () => {
    const products = await db.getProductsByPriceRange(100, 300);
    expect(Array.isArray(products)).toBe(true);
    
    // Verificar se todos os produtos estão dentro da faixa de preço
    products.forEach((product: any) => {
      const price = parseFloat(product.price);
      expect(price).toBeGreaterThanOrEqual(100);
      expect(price).toBeLessThanOrEqual(300);
    });
  });

  it("should get top products by popularity", async () => {
    const topProducts = await db.getTopProducts(5);
    expect(Array.isArray(topProducts)).toBe(true);
    expect(topProducts.length).toBeLessThanOrEqual(5);
    
    // Verificar se está ordenado por popularidade
    if (topProducts.length > 1) {
      for (let i = 0; i < topProducts.length - 1; i++) {
        expect(topProducts[i].popularity).toBeGreaterThanOrEqual(topProducts[i + 1].popularity);
      }
    }
  });

  it("should filter products with multiple criteria", async () => {
    const filtered = await db.getFilteredProducts({
      category: "Floral",
      minPrice: 100,
      maxPrice: 300,
      sortBy: "price_asc",
    });
    
    expect(Array.isArray(filtered)).toBe(true);
    
    filtered.forEach((product: any) => {
      expect(product.category).toBe("Floral");
      const price = parseFloat(product.price);
      expect(price).toBeGreaterThanOrEqual(100);
      expect(price).toBeLessThanOrEqual(300);
    });
  });

  it("should sort products by price ascending", async () => {
    const products = await db.getFilteredProducts({ sortBy: "price_asc" });
    
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        const currentPrice = parseFloat(products[i].price);
        const nextPrice = parseFloat(products[i + 1].price);
        expect(currentPrice).toBeLessThanOrEqual(nextPrice);
      }
    }
  });

  it("should sort products by price descending", async () => {
    const products = await db.getFilteredProducts({ sortBy: "price_desc" });
    
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        const currentPrice = parseFloat(products[i].price);
        const nextPrice = parseFloat(products[i + 1].price);
        expect(currentPrice).toBeGreaterThanOrEqual(nextPrice);
      }
    }
  });

  it("should sort products by popularity", async () => {
    const products = await db.getFilteredProducts({ sortBy: "popularity" });
    
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].popularity).toBeGreaterThanOrEqual(products[i + 1].popularity);
      }
    }
  });

  it("should filter by category only", async () => {
    const products = await db.getFilteredProducts({ category: "Citrico" });
    
    expect(Array.isArray(products)).toBe(true);
    products.forEach((product: any) => {
      expect(product.category).toBe("Citrico");
    });
  });
});
