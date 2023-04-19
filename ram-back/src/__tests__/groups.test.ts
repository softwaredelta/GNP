// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup, getUserGroups } from "../app/groups";
import { createUser } from "../app/user";
import { getDataSource } from "../arch/db-client";
import { GroupUserStatus } from "../entities/group-user.entity";
import { GroupEnt } from "../entities/group.entity";
import { UserEnt } from "../entities/user.entity";

describe("groups", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
  });

  it("creates groups successfully", async () => {
    const groupNames = Array.from({ length: 5 }, (_, i) => `group/${i}`);

    await Promise.all(groupNames.map((name) => createGroup({ name })));
  });

  describe("when users and groups exist", () => {
    let users: UserEnt[];
    let groups: GroupEnt[];

    beforeEach(async () => {
      const password = "password7812361";
      const emails = Array.from({ length: 5 }, (_, i) => `${i}@mail.com`);

      users = await Promise.all(
        emails.map((email) =>
          createUser({ email, password }).then(({ user }) => user),
        ),
      );
      const groupNames = Array.from({ length: 5 }, (_, i) => `group/${i}`);

      groups = await Promise.all(
        groupNames.map((name) =>
          createGroup({ name }).then(({ group }) => group),
        ),
      );
    });

    it("adds user to groups successfully", async () => {
      await addUserToGroup({
        groupId: groups[0].id,
        userId: users[0].id,
        status: GroupUserStatus.ACTIVE,
      });

      await addUserToGroup({
        groupId: groups[1].id,
        userId: users[0].id,
        status: GroupUserStatus.INACTIVE,
      });

      const userGroups = await getUserGroups({ userId: users[0].id });

      expect(userGroups.groups).toHaveLength(2);
    });
  });
});
