// (c) Delta Software 2023, rights reserved.

import { createSale, updateSale } from "../../app/sale";
import { getDataSource } from "../../arch/db-client";
import {
  AssuranceTypeError,
  createAssuranceType,
} from "../../app/assuranceType";
import { UserError, createUser } from "../../app/user";
import { AssuranceTypeEnt } from "../../entities/assurance-type.entity";
import { UserEnt } from "../../entities/user.entity";

describe("app:sale", () => {
  let assurance1: {
    assuranceType: AssuranceTypeEnt;
    error?: AssuranceTypeError;
  };
  let assurance2: {
    assuranceType: AssuranceTypeEnt;
    error?: AssuranceTypeError;
  };
  let user1: {
    user: UserEnt;
    error?: UserError;
  };

  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
    assurance1 = await createAssuranceType({
      name: "test-assurance-type-1",
      description: "test-assurance-type-1-description",
    });
    assurance2 = await createAssuranceType({
      name: "test-assurance-type-2",
      description: "test-assurance-type-2-description",
    });
    user1 = await createUser({
      email: "test@delta.tec.mx",
      password: "test-password",
    });
  });

  describe("creation function", () => {
    it("creates new sale", async () => {
      const { sale, error } = await createSale({
        policyNumber: "123456",
        assuranceTypeId: assurance1.assuranceType.id,
        userId: user1.user.id,
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
        assuranceTypeId: assurance1.assuranceType.id,
        userId: user1.user.id,
        paidDate: new Date("2021/01/01"),
        yearlyFee: "123456",
        contractingClient: "Halim",
        evidenceUrl: "https://www.google.com",
        periodicity: "mensual",
        emissionDate: new Date("2021/01/01"),
        insuredCostumer: "Jordana",
        paidFee: "123456",
      });

      const updated = await updateSale({
        id: sale.id,
        policyNumber: "936583645",
        paidFee: "654321",
      });

      expect(updated.sale).toHaveProperty("policyNumber", "936583645");
      expect(updated.sale).toHaveProperty("paidFee", 654321);
    });

    it("update assurance type", async () => {
      const sale = await createSale({
        policyNumber: "123456",
        assuranceTypeId: assurance1.assuranceType.id,
        userId: user1.user.id,
        paidDate: new Date("2021/01/01"),
        yearlyFee: "123456",
        contractingClient: "Halim",
        evidenceUrl: "https://www.google.com",
        periodicity: "mensual",
        emissionDate: new Date("2021/01/01"),
        insuredCostumer: "Jordana",
        paidFee: "123456",
      });

      console.log(sale);

      const updated = await updateSale({
        id: sale.sale.id,
        assuranceTypeId: assurance2.assuranceType.id,
      });

      expect(updated.sale).toHaveProperty(
        "assuranceTypeId",
        assurance2.assuranceType.id,
      );
    });
  });
});
