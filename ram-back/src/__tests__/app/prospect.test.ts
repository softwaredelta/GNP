// (c) Delta Software 2023, rights reserved.

import { DataSource } from "typeorm";
import { createProspect } from "../../app/prospect";
import { createStatus } from "../../app/status";
import { createUser } from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { StatusNames } from "../../entities/status.entity";

describe("prospect", () => {
  let ds: DataSource;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);
  });

  it("test the prospect", async () => {
    const user1 = await createUser({
      email: "test-email-1",
      password: "test-password-1",
    });

    await createStatus({
      statusName: StatusNames.NEW,
    });

    const { prospect: prospect1 } = await createProspect({
      name: "test-name-1",
      firstSurname: "test-first-surname-1",
      secondSurname: "test-second-surname-1",
      userId: user1.user.id,
    });

    expect(prospect1).toHaveProperty("id");
    expect(prospect1).toHaveProperty("name", "test-name-1");
    expect(prospect1).toHaveProperty("firstSurname", "test-first-surname-1");
    expect(prospect1).toHaveProperty("secondSurname", "test-second-surname-1");
    expect(prospect1).toHaveProperty("userId", user1.user.id);

    expect(prospect1.prospectStatus).toHaveLength(1);

    expect(prospect1.prospectStatus[0].statusComment).toBe("Nuevo prospecto");
    expect(prospect1.prospectStatus[0].status.statusName).toBe(StatusNames.NEW);
  });
});
