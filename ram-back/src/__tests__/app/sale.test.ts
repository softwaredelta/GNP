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
        policyNumber: "123456789",
        assuranceTypeId: "test-at-1",
        userId: "test-user",
        sellDate: new Date("2021/01/01"),
        amountInCents: "1234567",
        clientName: "Juan Perez",
        periodicity: "mensual",
        evidenceUrl:
          "blob:http://localhost:3000/3f7f2230-cfbc-4bd7-82b1-1248b1b9b741",
      });

      expect(error).toBeUndefined();
      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("policyNumber", "123456789");
      expect(sale).toHaveProperty("clientName", "Juan Perez");
      expect(sale).toHaveProperty("amountInCents", "1234567");
      expect(sale).toHaveProperty("periodicity", "mensual");
      expect(sale).toHaveProperty(
        "evidenceUrl",
        "blob:http://localhost:3000/3f7f2230-cfbc-4bd7-82b1-1248b1b9b741",
      );
    });
  });
});
