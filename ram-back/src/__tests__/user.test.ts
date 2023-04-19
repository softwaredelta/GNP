// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { app } from "../controller";
import { getDataSource } from "../arch/db-client";
import { UserEnt } from "../entities/user.entity";
import { createUser } from "../app/user";

describe("user", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.manager.clear(UserEnt);

    await createUser({
      email: "fermin@delta.tec.mx",
      password: "L3LitoB3b3ciT0Itc",
    });
  });

  describe("creation handler", () => {
    it("creates an user with valid parameters", async () => {
      await request(app)
        .post("/user/create")
        .send({
          email: "keny@delta.tec.mx",
          password: "L3LitoB3b3ciT0Itc",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          delete response.body.id;
          expect(response.body).toMatchObject({
            email: "keny@delta.tec.mx",
            password: "L3LitoB3b3ciT0Itc",
          });
        });
    });

    it("rejects duplicated user", async () => {
      await request(app)
        .post("/user/create")
        .send({
          email: "fermin@delta.tec.mx",
          password: "password7812361",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty("message", "USER_EXISTS");
        });
    });

    it("rejects bad data", async () => {
      await request(app)
        .post("/user/create")
        .send()
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty("message", "BAD_DATA");
        });
    });
  });

  describe("authentication handler", () => {
    it("logins user with valid credentials", async () => {
      return request(app)
        .post("/user/authenticate")
        .send({
          email: "fermin@delta.tec.mx",
          password: "L3LitoB3b3ciT0Itc",
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("accessToken");
          expect(response.body).toHaveProperty("accessTokenExpiresAt");
          expect(response.body).toHaveProperty("refreshToken");
          expect(response.body).toHaveProperty("refreshTokenExpiresAt");
          expect(response.body).toHaveProperty("username");
          expect(response.body).toHaveProperty("userRole");
        });
    });

    it("rejects login with invalid credentials", async () => {
      return request(app)
        .post("/user/authenticate")
        .send({
          email: "fermin@delta.tec.mx",
          password: "wrongpassword",
        })
        .expect(401)
        .then((response) => {
          expect(response.body).toHaveProperty("message", "USER_NOT_FOUND");
        });
    });

    it("rejects login with no credentials", async () => {
      return request(app)
        .post("/user/authenticate")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty("message", "BAD_DATA");
        });
    });
  });

  describe("authentication middleware", () => {
    it("authenticates with bearer token", async () => {
      const response = await request(app)
        .post("/user/authenticate")
        .send({
          email: "fermin@delta.tec.mx",
          password: "L3LitoB3b3ciT0Itc",
        })
        .expect(200)
        .then((res) => res.body);

      expect(response).toHaveProperty("accessToken");
      expect(response.accessToken).toBeTruthy();
      expect(typeof response.accessToken).toBe("string");

      const accessToken = response.accessToken as string;

      return request(app)
        .get("/user/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("email");
          expect(res.body).toHaveProperty("password");
          expect(res.body).toHaveProperty("id");
        });
    });

    it("rejects missing authorization", async () => {
      return request(app)
        .get("/user/me")
        .set("Authorization", `Bearer blablabla`)
        .expect(401)
        .then((res) => {
          expect(res.body).toHaveProperty("message", "USER_TOKEN_INVALID");
        });
    });
  });

  describe("refresh token handler", () => {
    it("refreshes token", async () => {
      const response = await request(app)
        .post("/user/authenticate")
        .send({
          email: "fermin@delta.tec.mx",
          password: "L3LitoB3b3ciT0Itc",
        })
        .then((res) => res.body);

      const refreshToken = response.refreshToken as string;

      const newToken = await request(app)
        .post("/user/refresh")
        .send({
          refreshToken,
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("accessToken");
          expect(res.body).toHaveProperty("accessTokenExpiresAt");
          expect(res.body).toHaveProperty("username");
          expect(res.body).toHaveProperty("userRole");
          return res.body;
        });

      return request(app)
        .get("/user/me")
        .set("Authorization", `Bearer ${newToken.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("email");
          expect(res.body).toHaveProperty("password");
          expect(res.body).toHaveProperty("id");
        });
    });

    it("rejects invalid refresh tokens", async () => {
      return request(app)
        .post("/user/refresh")
        .send({
          refreshToken: "blablabla",
        })
        .expect(401)
        .then((res) => {
          expect(res.body).toHaveProperty("message", "Invalid token");
        });
    });
  });
});
