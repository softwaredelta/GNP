// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { adminSeeds, userSeeds } from "../../seeds";

describe("controller:user", () => {
  let adminAccessToken: string;
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);

    await adminSeeds();
    await createUser({
      id: "1",
      email: "fermin@delta.tec.mx",
      password: "L3LitoB3b3ciT0Itc",
    });

    const { auth } = await authenticateUser({
      email: "admin@delta.tec.mx",
      password: "password",
    });
    adminAccessToken = auth.accessToken;
  });

  describe("creation handler", () => {
    it("creates an user with valid parameters", async () => {
      await request(app)
        .post("/user/create")
        .send({
          email: "kenny@delta.tec.mx",
          password: "L3LitoB3b3ciT0Itc",
          name: "Kenny",
          lastName: "McCormick",
          role: "regular",
        })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("id");
          expect(response.body).toHaveProperty("email");
          expect(response.body).toHaveProperty("password");
          expect(response.body).toHaveProperty("name");
          expect(response.body).toHaveProperty("lastName");
        });
    });

    it("rejects duplicated user", async () => {
      await request(app)
        .post("/user/create")
        .send({
          email: "fermin@delta.tec.mx",
          password: "password7812361",
          name: "Fermin",
          lastName: "Gonzalez",
          role: "regular",
        })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${adminAccessToken}`)
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
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect("Content-Type", /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty("message", "BAD_DATA");
        });
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
          expect(response.body).toHaveProperty("roles");
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
          expect(res.body).toHaveProperty("roles");
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

  describe("fuzzy user search", () => {
    beforeEach(async () => {
      await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "1",
      });
      await createUser({
        email: "test-u-2@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "2",
      });
      await createUser({
        email: "test-u-3@delta.tec.mx",
        password: "password",
        name: "Example Person",
        lastName: "1",
      });
      await createUser({
        email: "test-u-4@delta.tec.mx",
        password: "password",
        name: "Example Person",
        lastName: "2",
        imageUrl: "https://example.com/image.png",
      });
    });

    it("rejects unauthenticated request", async () => {
      return request(app)
        .get("/user/fuzzy-search")
        .query({ query: "use" })
        .send()
        .expect(401);
    });

    it("returns users with matching name", async () => {
      await userSeeds();
      const managerAccessToken = await authenticateUser({
        email: "manager@delta.tec.mx",
        password: "password",
      }).then(({ auth }) => auth.accessToken);

      const users = await request(app)
        .get("/user/fuzzy-search")
        .query({ query: "use" })
        .set("Authorization", `Bearer ${managerAccessToken}`)
        .send()
        .expect(200)
        .then((res) => res.body);

      expect(users).toHaveLength(4);
      expect(users[0]).toHaveProperty("name", "Manager");
      expect(users[1]).toHaveProperty("name", "Regular");
    });
  });

  describe("get all members", () => {
    beforeEach(async () => {
      await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "1",
        imageUrl: "https://example.com/image.png",
      });
      await createUser({
        email: "test-u-2@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "2",
        imageUrl: "https://example2.com/image.png",
      });
      await createUser({
        email: "test-u-3@delta.tec.mx",
        password: "password",
        name: "Example Person",
        lastName: "1",
        imageUrl: "https://example3.com/image.png",
      });
    });

    it("rejects unauthenticated request", async () => {
      return request(app)
        .get("/user/members")
        .query({ query: "use" })
        .send()
        .expect(401);
    });

    it("return members information correctly", async () => {
      await userSeeds();
      const managerAccessToken = await authenticateUser({
        email: "manager@delta.tec.mx",
        password: "password",
      }).then(({ auth }) => auth.accessToken);

      const users = await request(app)
        .get("/user/members")
        .query({ query: "use" })
        .set("Authorization", `Bearer ${managerAccessToken}`)
        .send()
        .expect(200)
        .then((res) => res.body);
      
      

    });
  });
});
