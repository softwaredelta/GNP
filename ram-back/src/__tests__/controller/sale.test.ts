// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { createAssuranceType } from "../../app/assuranceType";
import { AssuranceTypeEnt } from "../../entities/assurance-type.entity";
import { SaleError } from "../../app/sale";

describe("controller:sale", () => {
  let accessToken: string;
  let assurance: AssuranceTypeEnt;
  let userId: string;
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);

    const { user, error: userError } = await createUser({
      email: "test@delta.tec.mx",
      password: "12345678//",
    });
    if (userError) {
      throw new Error(userError);
    }
    userId = user.id;

    const { auth, error: authError } = await authenticateUser({
      email: "test@delta.tec.mx",
      password: "12345678//",
    });
    if (authError) {
      throw new Error(authError);
    }

    const { assuranceType, error: assuranceError } = await createAssuranceType({
      name: "basic-type",
    });
    if (assuranceError) {
      throw new Error(assuranceError);
    }
    assurance = assuranceType;

    accessToken = auth.accessToken;
  });

  describe("creation endpoint", () => {
    it("rejects unauthenticated request", async () => {
      return request(app).post("/sales/create").send().expect(401);
    });

    it("rejects bad data", async () => {
      const data = {
        policyNumber: "123456789",
        assuranceType: assurance,
        sellDate: "2021-10-10",
        amountInCents: "100000",
        clientName: "john doe",
      };

      const fields = Object.keys(data);

      await Promise.all(
        fields.map((field) => {
          const badData = { ...data, [field]: undefined };
          return request(app)
            .post("/sales/create")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(badData)
            .expect(400)
            .then((res) => {
              expect(res.body).toMatchObject({
                message: "BAD_DATA",
              });
            });
        }),
      );
    });

    it("accepts valid data", async () => {
      const data = {
        policyNumber: "123456789",
        assuranceTypeId: assurance.id,
        sellDate: "2021-10-10",
        amountInCents: "100000",
        clientName: "john doe",
      };

      return request(app)
        .post("/sales/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("policyNumber", data.policyNumber);
          expect(res.body).toHaveProperty("status");
          expect(res.body).toHaveProperty("user.id", userId);
        });
    });

    it("rejects additional fields", async () => {
      const data = {
        policyNumber: "123456789",
        assuranceTypeId: assurance.id,
        sellDate: "2021-10-10",
        amountInCents: "100000",
        clientName: "john doe",
        additionalField: "additional value",
      };

      return request(app)
        .post("/sales/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({
            message: "BAD_DATA",
          });
        });
    });

    it("rejects duplicated policy number", async () => {
      const data = {
        policyNumber: "123456789",
        assuranceTypeId: assurance.id,
        sellDate: "2021-10-10",
        amountInCents: "100000",
        clientName: "john doe",
      };

      await request(app)
        .post("/sales/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(201);

      await request(app)
        .post("/sales/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({
            message: SaleError.SALE_ERROR,
          });
        });
    });

    it("rejects invalid policy assurance type", async () => {
      const data = {
        policyNumber: "123456789",
        assuranceTypeId: "invalid-id",
        sellDate: "2021-10-10",
        amountInCents: "100000",
        clientName: "john doe",
      };

      return request(app)
        .post("/sales/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({
            message: SaleError.SALE_ERROR,
          });
        });
    });
  });
});