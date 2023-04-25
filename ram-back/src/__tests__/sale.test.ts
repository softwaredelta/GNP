// (c) Delta Software 2023, rights reserved.

// import request from "supertest";
// import { app } from "../controller";
import { createSale } from "../app/sale";
import { getDataSource } from "../arch/db-client";
import { createAssuranceType } from "../app/assuranceType";
import { createUser } from "../app/user";

describe("sale", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
    await createAssuranceType({
      name: "test-assurance-type-1",
      description: "test-assurance-type-1-description",
      id: "test-at-1",
    });
    await createUser({
      email: "test@delta.tec.mx",
      password: "test-password",
      id: "test-user",
    });
  });

  describe("creation function works", () => {
    it("creates new sale", async () => {
      const { sale, error } = await createSale({
        policyNumber: "123456789",
        assuranceType: {
          name: "test-assurance-type-1",
          description: "test-assurance-type-1-description",
          id: "test-at-1",
        },
        user: {
          email: "test@delta.tec.mx",
          password: "test-password",
          id: "test-user",
        },
        sellDate: new Date("2021/01/01"),
        amountInCents: "1234567",
        clientName: "Juan Perez",
        evidenceUrl: "https://www.google.com",
      });

      expect(error).toBeUndefined();
      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("policyNumber", "123456789");
      expect(sale).toHaveProperty("clientName", "Juan Perez");
      expect(sale).toHaveProperty("amountInCents", "1234567");
    });
  });
});
