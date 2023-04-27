// (c) Delta Software 2023, rights reserved.

import {
  UserRole,
  addRoleToUser,
  authenticateUser,
  createUser,
  userHasRole,
} from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { UserEnt } from "../../entities/user.entity";

describe("app:user", () => {
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

    it("gives regular user role by default", async () => {
      const { user, error } = await createUser({
        email: "user-3@delta.tec.mx",
        password: "password",
      });

      expect(error).toBeUndefined();
      expect(user).toHaveProperty("rolesString", "regular");
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

      expect(userHasRole({ user, role: UserRole.REGULAR })).toBe(true);
      expect(userHasRole({ user, role: UserRole.ADMIN })).toBe(false);

      await addRoleToUser({
        userId,
        role: UserRole.ADMIN,
      });

      user = await ds.manager.findOneOrFail(UserEnt, {
        where: { id: userId },
      });

      expect(userHasRole({ user, role: UserRole.REGULAR })).toBe(true);
      expect(userHasRole({ user, role: UserRole.ADMIN })).toBe(true);

      await addRoleToUser({
        userId,
        role: UserRole.ADMIN,
      });

      user = await ds.manager.findOneOrFail(UserEnt, {
        where: { id: userId },
      });

      expect(userHasRole({ user, role: UserRole.REGULAR })).toBe(true);
      expect(userHasRole({ user, role: UserRole.ADMIN })).toBe(true);
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
});
