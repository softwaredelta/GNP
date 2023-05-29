// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { app } from "../../controller";
import { authenticateUser, createUser, addLink } from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { adminSeeds, userSeeds } from "../../seeds";
import { UserEnt } from "../../entities/user.entity";
import { UserLinkEnt } from "../../entities/user-link.entity";

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

      return request(app)
        .get("/user/members")
        .query({ query: "use" })
        .set("Authorization", `Bearer ${managerAccessToken}`)
        .send()
        .expect(200)
        .then((res) => res.body);
    });
  });

  describe("modifies user succesfully", () => {
    let userId: string;
    let regularAccessToken: string;
    beforeEach(async () => {
      const { user: createdUser, error } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "1",
        imageUrl: "https://example.com/image.png",
      });
      expect(error).toBeUndefined();
      userId = createdUser.id;

      await userSeeds();

      const regularAuthenticationResponse = await request(app)
        .post("/user/authenticate")
        .send({
          email: "regular@delta.tec.mx",
          password: "password",
        })
        .then((res) => res.body);

      regularAccessToken = regularAuthenticationResponse.accessToken;
    });

    it("rejects unauthenticated request", async () => {
      return request(app).get(`/user/update/`).send().expect(401);
    });

    it("modifies the imageUrl", async () => {
      const modifiedImageUrl = "https://example.com/modified-image.png";

      await request(app)
        .post(`/user/update/${userId}`)
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({
          imageUrl: modifiedImageUrl,
        })
        .expect(200);

      const getRegularUserResponse = await request(app)
        .get(`/user/${userId}`)
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .expect(200);
      expect(getRegularUserResponse.body.imageUrl).toBe(modifiedImageUrl);
    });

    it("modifies the user successfully", async () => {
      const modifiedUser = {
        email: "nuevoemail@example.com",
        name: "Nuevo Nombre",
        lastName: "Nuevo Apellido",
        mobile: 1234567890,
        urlPP200: "https://urlPP200.com",
        CUA: "nuevoCUA",
        imageUrl: "https://nueva-imagen.com/imagen.jpg",
      };

      const response = await request(app)
        .post(`/user/update/${userId}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({
          email: modifiedUser.email,
          name: modifiedUser.name,
          lastName: modifiedUser.lastName,
          mobile: modifiedUser.mobile,
          urlPP200: modifiedUser.urlPP200,
          CUA: modifiedUser.CUA,
          imageUrl: modifiedUser.imageUrl,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("modifiedUser");
      // Asegúrate de verificar los campos modificados según tus necesidades
      expect(response.body.modifiedUser).toHaveProperty(
        "email",
        modifiedUser.email,
      );
      expect(response.body.modifiedUser).toHaveProperty(
        "name",
        modifiedUser.name,
      );
      expect(response.body.modifiedUser).toHaveProperty(
        "lastName",
        modifiedUser.lastName,
      );
      expect(response.body.modifiedUser).toHaveProperty(
        "urlPP200",
        modifiedUser.urlPP200,
      );
      expect(response.body.modifiedUser).toHaveProperty(
        "CUA",
        modifiedUser.CUA,
      );
    });
  });

  describe("changes user password", () => {
    let user: UserEnt;
    let regularAccessToken: string;
    beforeEach(async () => {
      const { user: createdUser, error } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "1",
        imageUrl: "https://example.com/image.png",
      });
      expect(error).toBeUndefined();
      user = createdUser;

      await userSeeds();

      const regularAuthenticationResponse = await request(app)
        .post("/user/authenticate")
        .send({
          email: "regular@delta.tec.mx",
          password: "password",
        })
        .then((res) => res.body);

      regularAccessToken = regularAuthenticationResponse.accessToken;
    });

    it("rejects unauthenticated request", async () => {
      return request(app)
        .get("/user/reset-password")
        .query({ query: "use" })
        .send()
        .expect(401);
    });

    it("rejects bad data", async () => {
      return request(app)
        .post(`/user/reset-password`)
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({
          password: "password",
          newPassword: "password", //CHECAR
        })
        .expect(400);
    });

    it("modifies the password", async () => {
      const newPasswordC = "newpassword";

      const res = await request(app)
        .post(`/user/reset-password`)
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({
          email: user.email,
          password: newPasswordC,
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password reset successfully");
    });
  });

  describe("Functions of user's links", () => {
    let link: UserLinkEnt;
    let user: UserEnt;
    let regularAccessToken: string;
    beforeEach(async () => {
      const { link: addedLink, error: errorlink } = await addLink({
        id: "1",
        link: "https://example.com",
        name: "Example",
      });
      expect(errorlink).toBeUndefined();
      link = addedLink;

      const { user: createdUser, error } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "last name",
        imageUrl: "https://example.com/image.png",
        id: "1",
      });
      expect(error).toBeUndefined();
      user = createdUser;

      await userSeeds();

      const regularAuthenticationResponse = await request(app)
        .post("/user/authenticate")
        .send({
          email: "regular@delta.tec.mx",
          password: "password",
        })
        .then((res) => res.body);

      regularAccessToken = regularAuthenticationResponse.accessToken;
    });

    it("rejects unauthenticated request", async () => {
      return request(app)
        .get("/user/reset-password")
        .query({ query: "use" })
        .send()
        .expect(401);
    });

    it("adds new link to a user's links", async () => {
      const link = "https://example.com";
      const name = "Example Link";
    
      const res = await request(app)
        .post(`/user/add-link/${user.id}`)
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({ link, name })
        .expect(200);
    
      expect(res.body.newLink).toBeDefined();
      expect(res.body.newLink.link).toEqual(link);
      expect(res.body.newLink.name).toEqual(name);
    });

    it("modifies an existing user link", async () => {
      const updatedLink = {
        link: "https://newexample.com",
        name: "New Example",
      };

      const res = await request(app)
        .post("/user/edit-link")
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({ id: link.id, ...updatedLink })
        .expect(200);

      const { uLink } = res.body;

      expect(uLink).toHaveProperty("id", link.id);
      expect(uLink).toHaveProperty("link", updatedLink.link);
      expect(uLink).toHaveProperty("name", updatedLink.name);
    });

    it("deletes existing user link", async () => {
      const res = await request(app)
        .post("/user/delete-link")
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .send({ id: link.id })
        .expect(200);

      expect(res.body.links.affected).toBe(1);
    });

    it("gets a user with their links", async () => {
      const res = await request(app)
        .get(`/user/links/${user.id}`)
        .set("Authorization", `Bearer ${regularAccessToken}`)
        .expect(200);

      const { links } = res.body;

      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
