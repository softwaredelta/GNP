// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { createAssuranceType } from "../../app/assuranceType";
import { AssuranceTypeEnt } from "../../entities/assurance-type.entity";
import { DataSource } from "typeorm";
import { SellEnt } from "../../entities/sell.entity";
import { createSale } from "../../app/sale";

describe("controller:sale", () => {
  let accessToken: string;
  let assurance: AssuranceTypeEnt;
  let userId: string;
  let ds: DataSource;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);

    const { error: userError, user } = await createUser({
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
    accessToken = auth.accessToken;

    const { assuranceType, error: assuranceError } = await createAssuranceType({
      name: "basic-type",
    });
    if (assuranceError) {
      throw new Error(assuranceError);
    }
    assurance = assuranceType;
  });

  describe("tests", () => {
    describe("authentication", () => {
      it("rejects unauthenticated requests", async () => {
        return request(app).post("/sales/create").send({}).expect(401);
      });

      it("allows authenticated request", async () => {
        return request(app)
          .post("/sales/create")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ message: "BAD_DATA" });
          });
      });
    });

    describe("validation", () => {
      it("rejects empty request", async () => {
        return request(app)
          .post("/sales/create")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ message: "BAD_DATA" });
          });
      });

      it("rejects request with no file upload", async () => {
        return request(app)
          .post("/sales/create")
          .set("Authorization", `Bearer ${accessToken}`)
          .field("policyNumber", "123456789")
          .field("paidDate", "2021-10-10")
          .field("yearlyFee", "100000")
          .field("contractingClient", "john doe")
          .field("assuranceTypeId", assurance.id)
          .field("periodicity", "Anual")
          .field("emissionDate", "2022-10-01")
          .field("insuredCostumer", "john doe")
          .field("paidFee", "5000")
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({
              message: "NO_FILE_UPLOAD",
            });
          });
      });

      it("rejects request with additional values", async () => {
        const file = {
          buffer: Buffer.from("policy contents"),
          originalname: "policy.txt",
          encoding: "utf-8",
          mimetype: "plain/txt",
        } as Express.Multer.File;

        return request(app)
          .post("/sales/create")
          .set("Authorization", `Bearer ${accessToken}`)
          .attach("file", file.buffer, file.originalname)
          .field("policyNumber", "123456789")
          .field("paidDate", "2021-10-10")
          .field("yearlyFee", "100000")
          .field("contractingClient", "john doe")
          .field("assuranceTypeId", assurance.id)
          .field("periodicity", "Anual")
          .field("emissionDate", "2022-10-01")
          .field("insuredCostumer", "john doe")
          .field("paidFee", "5000")
          .field("some-field", "boo")
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ message: "BAD_DATA" });
          });
      });

      it("accepts valid data and file upload", async () => {
        const file = {
          buffer: Buffer.from("policy contents"),
          originalname: "policy.txt",
          encoding: "utf-8",
          mimetype: "plain/txt",
        } as Express.Multer.File;

        return request(app)
          .post("/sales/create")
          .set("Authorization", `Bearer ${accessToken}`)
          .attach("file", file.buffer, file.originalname)
          .field("policyNumber", "123456789")
          .field("paidDate", "2021-10-10")
          .field("yearlyFee", "100000")
          .field("contractingClient", "john doe")
          .field("assuranceTypeId", assurance.id)
          .field("periodicity", "Anual")
          .field("emissionDate", "2022-10-01")
          .field("insuredCostumer", "john doe")
          .field("paidFee", "5000")
          .expect(201)
          .then(({ body }) => {
            expect(body).toHaveProperty("policyNumber", "123456789");
            expect(body).toHaveProperty("status", "Sin revisar");
            expect(body.evidenceUrl).toMatch(/\d+\.txt/);
          });
      });
    });

    describe("functionality", () => {
      it("creates sale correctly", async () => {
        const file = {
          buffer: Buffer.from("policy contents"),
          originalname: "policy.txt",
          encoding: "utf-8",
          mimetype: "plain/txt",
        } as Express.Multer.File;

        await request(app)
          .post("/sales/create")
          .set("Authorization", `Bearer ${accessToken}`)
          .attach("file", file.buffer, file.originalname)
          .field("policyNumber", "123456789")
          .field("paidDate", "2021-10-10")
          .field("yearlyFee", "100000")
          .field("contractingClient", "john doe")
          .field("assuranceTypeId", assurance.id)
          .field("periodicity", "Anual")
          .field("emissionDate", "2022-10-01")
          .field("insuredCostumer", "john doe")
          .field("paidFee", "5000")
          .expect(201)
          .then(({ body }) => {
            expect(body).toHaveProperty("policyNumber", "123456789");
            expect(body).toHaveProperty("status", "Sin revisar");
            expect(body.evidenceUrl).toMatch(/\d+\.txt/);
          });

        const sales = await ds.manager.find(SellEnt);
        expect(sales).toHaveLength(1);
        expect(sales[0].policyNumber).toBe("123456789");
      });

      it("updates sale correctly", async () => {
        const { sale, error, reason } = await createSale({
          policyNumber: "123456",
          assuranceTypeId: assurance.id,
          userId: userId,
          paidDate: new Date("2021/01/01"),
          yearlyFee: "123456",
          contractingClient: "Juan Pérez",
          evidenceUrl: "https://www.google.com",
          periodicity: "mensual",
          emissionDate: new Date("2021/01/01"),
          insuredCostumer: "Juan Pérez",
          paidFee: "123456",
        });

        expect(reason).toBeUndefined();
        expect(error).toBeUndefined();
        expect(sale).toHaveProperty("id");

        await request(app)
          .post(`/sales/update/${sale.id}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .field("policyNumber", "123456789")
          .field("paidDate", "2021-10-10")
          .field("yearlyFee", "100000")
          .field("contractingClient", "john doe")
          .field("assuranceTypeId", assurance.id)
          .field("periodicity", "Anual")
          .field("emissionDate", "2022-10-01")
          .field("insuredCostumer", "john doe")
          .field("paidFee", "5000")
          .field("evidenceUrl", "img")
          .expect(200)
          .then(() => {});
      });
    });
  });
});
