// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { DataSource } from "typeorm";
import { createProspect } from "../../app/prospect";
import { userSeeds } from "../../seeds";
import { app } from "../../controller";
import { StatusNames } from "../../entities/status.entity";
import { createStatus } from "../../app/status";

describe("test for controller prospect", () => {
  let ds: DataSource;
  let regularAccessToken: string;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);

    const { regular } = await userSeeds();

    const { status } = await createStatus({
      statusName: StatusNames.NEW,
    });

    const { error } = await createProspect({
      name: "controller-test-prospect",
      firstSurname: "controller-test-prospect",
      secondSurname: "controller-test-prospect",
      comentary: "controller-test-prospect",
      statusId: status.id,
      userId: regular.id,
    });
    expect(error).toBeUndefined();

    const regularAuthenticationResponse = await request(app)
      .post("/user/authenticate")
      .send({
        email: "regular@delta.tec.mx",
        password: "password",
      })
      .then((res) => res.body);

    regularAccessToken = regularAuthenticationResponse.accessToken;
  });

  describe("Test endpoint get prospects", () => {
    describe("autentication", () => {
      it("rejects requests from non-regularUser", async () => {
        return request(app).get("/prospect/my-prospects").expect(401);
      });

      it("Accept requests from regularUser", async () => {
        return request(app)
          .get("/prospect/my-prospects")
          .set("Authorization", `Bearer ${regularAccessToken}`)
          .expect(200);
      });
    });
  });
});
