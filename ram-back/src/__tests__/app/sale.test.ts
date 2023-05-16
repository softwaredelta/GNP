// (c) Delta Software 2023, rights reserved.

import { createSale, updateSale } from "../../app/sale";
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
    await createAssuranceType({
      name: "test-assurance-type-2",
      description: "test-assurance-type-2-description",
      id: "test-at-2",
    });
    await createUser({
      email: "test@delta.tec.mx",
      password: "test-password",
      id: "test-user",
    });
    await createSale({
      id: "test-sale",
      policyNumber: "312345678",
      assuranceTypeId: "test-at-1.1",
      userId: "test-user-base",
      paidDate: new Date("2021/01/01"),
      yearlyFee: "123456",
      contractingClient: "Halim",
      evidenceUrl: "https://www.google.com",
      periodicity: "mensual",
      emissionDate: new Date("2021/01/01"),
      insuredCostumer: "Jordana",
      paidFee: "123456",
    });
  });

  describe("creation function", () => {
    it("creates new sale", async () => {
      const { sale, error } = await createSale({
        policyNumber: "123456",
        assuranceTypeId: "test-at-1",
        userId: "test-user",
        paidDate: new Date("2021/01/01"),
        yearlyFee: "123456",
        contractingClient: "Juan Pérez",
        evidenceUrl: "https://www.google.com",
        periodicity: "mensual",
        emissionDate: new Date("2021/01/01"),
        insuredCostumer: "Juan Pérez",
        paidFee: "123456",
      });

      expect(error).toBeUndefined();
      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("policyNumber", "123456");
      expect(sale).toHaveProperty("contractingClient", "Juan Pérez");
      expect(sale).toHaveProperty("yearlyFee", "123456");
    });
  });

  describe("update function", () => {
    it("update existing sale", async () => {
      const { sale } = await createSale({
        policyNumber: "123456",
        assuranceTypeId: "test-at-1",
        userId: "test-user",
        paidDate: new Date("2021/01/01"),
        yearlyFee: "123456",
        contractingClient: "Halim",
        evidenceUrl: "https://www.google.com",
        periodicity: "mensual",
        emissionDate: new Date("2021/01/01"),
        insuredCostumer: "Jordana",
        paidFee: "123456",
      });
      expect(sale).toHaveProperty("id");

      const updated = await updateSale({
        id: sale.id,
        policyNumber: "936583645",
        paidFee: "654321",
      });

      expect(updated.sale).toHaveProperty("policyNumber", "936583645");
      expect(updated.sale).toHaveProperty("paidFee", 654321);
    });

    it("update assurance type", async () => {
      const { sale } = await createSale({
        policyNumber: "123456",
        assuranceTypeId: "test-at-1",
        userId: "test-user",
        paidDate: new Date("2021/01/01"),
        yearlyFee: "123456",
        contractingClient: "Halim",
        evidenceUrl: "https://www.google.com",
        periodicity: "mensual",
        emissionDate: new Date("2021/01/01"),
        insuredCostumer: "Jordana",
        paidFee: "123456",
      });
      expect(sale).toHaveProperty("id");

      const updated = await updateSale({
        id: sale.id,
        assuranceTypeId: "test-at-2",
      });

      expect(updated.sale).toHaveProperty("assuranceTypeId", "test-at-2");
    });
  });
});
