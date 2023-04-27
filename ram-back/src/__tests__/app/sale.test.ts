// (c) Delta Software 2023, rights reserved.

import { createSale } from "../../app/sale";
import { getDataSource } from "../../arch/db-client";
import { createAssuranceType } from "../../app/assuranceType";
import { createUser } from "../../app/user";

describe("app:sale", () => {
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

  describe("creation function", () => {
    it("creates new sale", async () => {
      const { sale, error } = await createSale({
        policyNumber: "123456",
        assuranceType: {
          id: "test-at-1",
        },
        user: {
          id: "test-user",
        },
        sellDate: new Date("2021/01/01"),
        amountInCents: "123456",
        clientName: "Juan Perez",
        evidenceUrl: "https://www.google.com",
      });

      expect(error).toBeUndefined();
      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("policyNumber", "123456");
      expect(sale).toHaveProperty("clientName", "Juan Perez");
      expect(sale).toHaveProperty("amountInCents", "123456");
    });
  });
});
