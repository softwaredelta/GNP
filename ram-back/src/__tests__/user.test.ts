// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { app } from "../controller";
import { authenticateUser, createUser } from "../app/user";
import { getDataSource } from "../arch/db-client";

describe("user", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);

    await createUser({
      id: "1",
      email: "fermin@delta.tec.mx",
      password: "L3LitoB3b3ciT0Itc",
    });
  });

  describe("creation function", () => {
    it("creates user with hashed password", async () => {
      const { user, error } = await createUser({
        email: "user-0@delta.tec.mx",
        password: "password",
      });

      expect(error).toBeUndefined();
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email", "user-0@delta.tec.mx");
      expect(user).toHaveProperty("password");
      expect(user.password).not.toBe("password");
    });

    it("creates diffrent hashes for same password", async () => {
      const { user: user1, error: error1 } = await createUser({
        email: "user-1@delta.tec.mx",
        password: "password",
      });

      const { user: user2, error: error2 } = await createUser({
        email: "user-2@delta.tec.mx",
        password: "password",
      });

      expect(error1).toBeUndefined();
      expect(error2).toBeUndefined();
      expect(user1.password).not.toBe(user2.password);
    });
  });

  describe("authentication function", () => {
    it("authenticates user with valid credentials", async () => {
      const { auth, error } = await authenticateUser({
        email: "fermin@delta.tec.mx",
        password: "L3LitoB3b3ciT0Itc",
      });

      expect(error).toBeUndefined();
      expect(auth).toHaveProperty("accessToken");
    });

    it("rejects user with invalid credentials", async () => {
      const { auth, error } = await authenticateUser({
        email: "fermin@delta.tec.mx",
        password: "L3LitoB3b3ciT0Itc-xx",
      });

      expect(error).toBeDefined();
      expect(auth).toMatchObject({});
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
          expect(response.body).toHaveProperty("id");
          expect(response.body).toHaveProperty("email");
          expect(response.body).toHaveProperty("password");
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
