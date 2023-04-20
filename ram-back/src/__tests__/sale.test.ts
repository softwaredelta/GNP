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
        assuranceType: { id: "123456", name: "vida", description: "vida", goals: [] },
        sellDate: new Date(),
        amountInCents: "123456",
        clientName: "Juan Perez"
      });

    //   expect(error).toBeUndefined();
    //   expect(sale).toHaveProperty("id");
    //   expect(sale).toHaveProperty("policyNumber", "123456");
    //   expect(sale).toHaveProperty("clientName", "Juan Perez");
    //   expect(sale).toHaveProperty("amountInCents", "123456");

    });
  });

});
