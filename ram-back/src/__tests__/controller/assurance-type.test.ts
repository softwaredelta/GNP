// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { AssuranceTypeError } from "../../app/assuranceType";

describe("controller:assurance-type", () => {
  let accessToken: string;
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);

    const { error: userError } = await createUser({
      email: "test@delta.tec.mx",
      password: "12345678//",
    });
    if (userError) {
      throw new Error(userError);
    }

    const { auth, error: authError } = await authenticateUser({
      email: "test@delta.tec.mx",
      password: "12345678//",
    });
    if (authError) {
      throw new Error(authError);
    }

    accessToken = auth.accessToken;
  });

  describe("creation endpoint", () => {
    it("rejects unauthenticated request", async () => {
      return request(app).post("/assurance-types/create").expect(401);
    });

    it("rejects missing parameters", async () => {
      const data = {
        name: "test",
        description: "test",
      };

      const fields = ["name", "description"];

      return Promise.all(
        fields.map(async (field) =>
          request(app)
            .post("/assurance-types/create")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ ...data, [field]: undefined })
            .expect(400)
            .then((res) => {
              expect(res.body).toMatchObject({ message: "BAD_DATA" });
            }),
        ),
      );
    });

    it("creates assurance type correctly", async () => {
      const data = {
        name: "test",
        description: "test",
      };

      return request(app)
        .post("/assurance-types/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("name");
        });
    });

    it("rejects duplicated types", async () => {
      const data = {
        name: "test",
        description: "test",
      };

      await request(app)
        .post("/assurance-types/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("name");
        });

      return request(app)
        .post("/assurance-types/create")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({
            message: AssuranceTypeError.ASSURANCE_TYPE_ERROR,
          });
        });
    });
  });
});
