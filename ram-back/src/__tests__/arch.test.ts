// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { UserEnt } from "../entities/user.entity";
import { getS3Api } from "../arch/s3-client";

describe("Architecture", () => {
  it("Should have db connection", async () => {
    const db = await getDataSource();
    const created = await db.manager.save(
      UserEnt,
      { email: "mail", id: "1", password: "pass" },
      {},
    );
    const found = await db.manager.findOne(UserEnt, {
      where: {
        id: "1",
      },
      select: ["id", "email", "password"],
    });
    expect(found).toMatchObject(created);
  });

  it("Should have s3 connection", async () => {
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
