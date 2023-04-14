// (c) Delta Software 2023, rights reserved.

import "reflect-metadata";
import { getDataSource } from "../arch/db-client";
import { UserEnt } from "../entities/user.entity";

export function divide(x: number, y: number): number {
  if (y === 0) {
    throw new Error("You can' t divide by zero.");
  }
  return Math.round(x / y);
}
describe("divide function ", () => {
  describe("when given to integers", () => {
    it("should return a division result", () => {});
  });
});

it("Should return a division result", () => {
  const [x, y, expected] = [40, 4, 10];
  const result = divide(x, y);
  expect(result).toEqual(expected);
});

it("Should have test env", () => {
  expect(process.env.NODE_ENV).toEqual("test");
});

it("Should have db conn", async () => {
  const db = await getDataSource();
  const created = await db.manager.save(
    UserEnt,
    { email: "mail", id: "1" },
    {},
  );
  const found = await db.manager.findOne(UserEnt, {
    where: {
      id: "1",
    },
    select: ["id", "email"],
  });
  expect(found).toMatchObject(created);
});
