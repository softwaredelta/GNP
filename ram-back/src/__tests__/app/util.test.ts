// (c) Delta Software 2023, rights reserved.

import { hashPassword, comparePassword } from "../../utils/hash";

describe("app:util", () => {
  describe("hashing functions", () => {
    it("hashes and compares password correctly", async () => {
      const pass = "L3LitoB3b3ciT0Itc";
      const hashPass = await hashPassword(pass);
      expect(comparePassword(pass, hashPass)).resolves.toBeTruthy();
    });

    it("rejects wrong password", async () => {
      const pass = "L3LitoB3b3ciT0Itc";
      const hashPass = await hashPassword(pass);
      expect(comparePassword("wrong-password", hashPass)).resolves.toBeFalsy();
    });
  });
});
