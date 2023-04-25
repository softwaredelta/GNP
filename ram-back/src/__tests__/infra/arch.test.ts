// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../../arch/db-client";
import { UserEnt } from "../../entities/user.entity";
import { getS3Api } from "../../arch/s3-client";
import { createUser } from "../../app/user";

describe("infra:arch", () => {
  it("should have db connection", async () => {
    const db = await getDataSource();
    await createUser({
      email: "test@delta.tec.mx",
      password: "password",
      id: "1",
    });

    const found = await db.manager.findOne(UserEnt, {
      where: {
        id: "1",
      },
      select: ["id", "email", "password"],
    });
    expect(found).toHaveProperty("id", "1");
    expect(found).toHaveProperty("email", "test@delta.tec.mx");
  });

  it("should have s3 connection", async () => {
    const s3 = await getS3Api();
    await s3.putObject("test", "hello");
    const download = await s3.getObject("test");
    const buf = [];
    for await (const chunk of download) {
      buf.push(chunk);
    }
    expect(Buffer.concat(buf).toString()).toBe("hello");
  });
});
