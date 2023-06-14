// (c) Delta Software 2023, rights reserved.

import {
  addRoleToUser,
  authenticateUser,
  createUser,
  fuzzySearchUsers,
  getAllUserRol,
  resetPassword,
  addLink,
  updateLink,
  deleteUser,
} from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { UserEnt, UserRole } from "../../entities/user.entity";
import { UserLinkEnt } from "../../entities/user-link.entity";

describe("app:user", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);

    await createUser({
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

    it("gives regular user role by default", async () => {
      const { user, error } = await createUser({
        email: "user-3@delta.tec.mx",
        password: "password",
      });

      expect(error).toBeUndefined();
      expect(user).toHaveProperty("rolesString", "regular");
    });

    it("correctly normalizes names and email", async () => {
      const { user } = await createUser({
        email: "  example@delta.tec.mx  ",
        password: "password",
        name: "  Fermin  ",
        lastName: "  Hernandez  Gonzalez ",
      });
      expect(user).toMatchObject({
        email: "example@delta.tec.mx",
        name: "Fermin",
        lastName: "Hernandez Gonzalez",
      });
    });
  });

  describe("role functions", () => {
    let userId: string;
    beforeEach(async () => {
      const { user } = await createUser({
        email: "user-4@delta.tec.mx",
        password: "password",
      });

      userId = user.id;
    });

    it("adds role to user", async () => {
      const ds = await getDataSource();
      let user = await ds.manager.findOneOrFail(UserEnt, {
        where: { id: userId },
      });

      expect(user.hasRole(UserRole.REGULAR)).toBe(true);
      expect(user.hasRole(UserRole.ADMIN)).toBe(false);

      await addRoleToUser({
        userId,
        role: UserRole.ADMIN,
      });

      user = await ds.manager.findOneOrFail(UserEnt, {
        where: { id: userId },
      });

      expect(user.hasRole(UserRole.REGULAR)).toBe(true);
      expect(user.hasRole(UserRole.ADMIN)).toBe(true);

      await addRoleToUser({
        userId,
        role: UserRole.ADMIN,
      });

      user = await ds.manager.findOneOrFail(UserEnt, {
        where: { id: userId },
      });

      expect(user.hasRole(UserRole.REGULAR)).toBe(true);
      expect(user.hasRole(UserRole.ADMIN)).toBe(true);
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

  describe("fuzzy search", () => {
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
      });
    });

    it("finds users by name", async () => {
      const users = await fuzzySearchUsers({
        query: "TEST",
      });
      expect(users).toHaveLength(2);
      expect(users[0]).toHaveProperty("name", "Test User");
      expect(users[1]).toHaveProperty("name", "Test User");
    });

    it("finds users by last name", async () => {
      const users = await fuzzySearchUsers({
        query: "2",
      });
      expect(users).toHaveLength(2);
      expect(users[0]).toHaveProperty("lastName", "2");
      expect(users[1]).toHaveProperty("lastName", "2");
    });
  });

  describe("getAllUserRol", () => {
    let userId: string;
    beforeEach(async () => {
      const { user } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: userId,
        imageUrl: "https://example.com/image.png",
      });
      userId = user.id;
    });
    it("finds all the users and the rol", async () => {
      const { userRol } = await getAllUserRol();
      expect(userRol).toHaveLength(2);
      expect(userRol[1]).toHaveProperty("name", "Test User");
      expect(userRol[1]).toHaveProperty("rol", "regular");
      expect(userRol[1]).toHaveProperty(
        "imageUrl",
        "https://example.com/image.png",
      );
    });

    it("return empty if doesn't exist users", async () => {
      const ds = await getDataSource();
      await ds.manager.delete(UserEnt, {
        id: userId,
      });

      const { userRol } = await getAllUserRol();
      expect(userRol).toHaveLength(1);
    });
  });

  describe("user links work", () => {
    let addedLink: UserLinkEnt;
    let userId: string;
    beforeEach(async () => {
      const { user } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: userId,
        imageUrl: "https://example.com/image.png",
      });
      userId = user.id;
    });

    beforeEach(async () => {
      const { link, error } = await addLink({
        id: userId,
        link: "https://example.com",
        name: "Example",
      });

      expect(error).toBeUndefined();
      addedLink = link;
    });

    it("adds a link to a user's link array", async () => {
      const { link, error } = await addLink({
        id: userId,
        link: "https://example.com",
        name: "Example Link",
      });

      expect(error).toBeUndefined();
      expect(link).toHaveProperty("id");
      expect(link).toHaveProperty("link", "https://example.com");
      expect(link).toHaveProperty("name", "Example Link");
    });

    it("modifies an already existing link", async () => {
      const linkId = addedLink.id;
      const newLink = "https://exampleAdd.com";
      const newName = "Example Link Add";

      const { link, error } = await updateLink({
        id: linkId,
        link: newLink,
        name: newName,
      });

      expect(error).toBeUndefined();
      expect(link).toHaveProperty("id", linkId);
      expect(link).toHaveProperty("link", newLink);
      expect(link).toHaveProperty("name", newName);
    });
  });

  describe("user password reset work", () => {
    let addedUser: UserEnt;
    let userId: string;
    beforeEach(async () => {
      const { user: user1 } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: userId,
        imageUrl: "https://example.com/image.png",
      });
      userId = user1.id;
      const { user, error } = await createUser({
        email: "test-u-2@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "1",
        imageUrl: "https://example.com/image.png",
      });
      expect(error).toBeUndefined();
      addedUser = user;
    });

    it("changes the password", async () => {
      await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: userId,
        imageUrl: "https://example.com/image.png",
      });
      await resetPassword({
        email: "test-u-1@delta.tec.mx",
        password: "password1234",
      });
    });

    it("password is hashed", async () => {
      const email = addedUser.email;
      const newPassword = "password1234";

      await resetPassword({ email: email, password: newPassword });

      const { auth, error } = await authenticateUser({
        email: email,
        password: newPassword,
      });

      expect(error).toBeUndefined();
      expect(auth).toHaveProperty("accessToken");
      expect(auth).toHaveProperty("accessTokenExpiresAt");
      expect(auth).toHaveProperty("refreshToken");
      expect(auth).toHaveProperty("refreshTokenExpiresAt");
      expect(auth).toHaveProperty("username", email);
      expect(auth).toHaveProperty("name", addedUser.name);
      expect(auth).toHaveProperty("lastName", addedUser.lastName);
    });
  });

  describe("Delete user", () => {
    let addedUser: UserEnt;
    beforeEach(async () => {
      const { user, error } = await createUser({
        email: "test-u-1@delta.tec.mx",
        password: "password",
        name: "Test User",
        lastName: "1",
        imageUrl: "https://example.com/image.png",
      });
      expect(error).toBeUndefined();
      addedUser = user;
    });

    it("delete user", async () => {
      const result = await deleteUser({
        id: addedUser.id,
      });

      expect(result.error).toBeUndefined();
      expect(result.user).toBeDefined();
      expect(result.user.id).toEqual(addedUser.id);
    });

    it("returns error if user is not found", async () => {
      const userId = "non_existing_user_id";

      const result = await deleteUser({ id: userId });

      expect(result.user).toEqual({} as UserEnt);
      expect(result.errorReason).toBeInstanceOf(Error);
    });
  });
});
