import request from "supertest";
import { app } from "../../controller";
import { getDataSource } from "../../arch/db-client";
import { UserRole } from "../../entities/user.entity";
import { userSeeds } from "../../seeds";

describe("controller:authentication", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
    await userSeeds();
  });

  describe("basic protected endpoint", () => {
    it("rejects unauthenticated requests", async () => {
      return request(app)
        .get("/user/me")
        .expect(401)
        .then((res) => {
          expect(res.body.message).toBe("No authorization header");
        });
    });

    it("returns user info including roles", async () => {
      const authenticationResponse = await request(app)
        .post("/user/authenticate")
        .send({
          email: "regular@delta.tec.mx",
          password: "password",
        })
        .expect(200);

      const accessToken = authenticationResponse.body.accessToken;

      return request(app)
        .get("/user/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("email");
          expect(res.body).toHaveProperty("roles", [UserRole.REGULAR]);
        });
    });

    it("rejects request with insufficient roles", async () => {
      const authenticationResponse = await request(app)
        .post("/user/authenticate")
        .send({
          email: "regular@delta.tec.mx",
          password: "password",
        })
        .expect(200);

      const accessToken = authenticationResponse.body.accessToken;

      return request(app)
        .get("/user/admin")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(403)
        .then((res) => {
          expect(res.body.message).toBe("Insufficient permissions");
        });
    });
  });
});
