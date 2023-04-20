// (c) Delta Software 2023, rights reserved.

// import request from "supertest";
// import { app } from "../controller";
import { createSale } from "../app/sale";
import { getDataSource } from "../arch/db-client";

describe("sale", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
  });

  describe("creation function works", () => {
    it("creates new sale", async () => {
      const { sale, error } = await createSale({
        id: "123456",
        policyNumber: "123456",
        assuranceType: {
          name: "test-assurance-type-1",
          description: "test-assurance-type-1-description",
          id: "test-at-1"
        },
        sellDate: new Date("2021/01/01"),
        amountInCents: "123456",
        clientName: "Juan Perez",
      });

    
      expect(sale).toBeDefined();
      expect(error).toBeDefined();
      //   expect(sale).toHaveProperty("id");
      //   expect(sale).toHaveProperty("policyNumber", "123456");
      //   expect(sale).toHaveProperty("clientName", "Juan Perez");
      //   expect(sale).toHaveProperty("amountInCents", "123456");
    });
  });
});
