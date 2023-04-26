// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup, getUserGroups } from "../../app/groups";
import { createUser } from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { GroupUserStatus } from "../../entities/group-user.entity";
import { GroupEnt } from "../../entities/group.entity";
import { UserEnt } from "../../entities/user.entity";

describe("app:groups", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
  });

  it("creates groups successfully", async () => {
    const groupNames = Array.from({ length: 5 }, (_, i) => `group/${i}`);

    await Promise.all(
      groupNames.map((name) =>
        createGroup({
          name,
          imageURL: "",
        }),
      ),
    );
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
          createGroup({
            name,
            imageURL: "",
          }).then(({ group }) => group),
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

  it("only gets correct user groups", async () => {
    const password = "password7812361";
    const email = "";
    const newUser = await createUser({ email, password }).then(
      ({ user }) => user,
    );
    const groupNames = Array.from({ length: 3 }, (_, i) => `group/${i}`);

    const groups = await Promise.all(
      groupNames.map((name) =>
        createGroup({
          name,
          imageURL: "",
        }).then(({ group }) => group),
      ),
    );

    await addUserToGroup({
      groupId: groups[0].id,
      userId: newUser.id,
      status: GroupUserStatus.ACTIVE,
    });
    await addUserToGroup({
      groupId: groups[1].id,
      userId: newUser.id,
      status: GroupUserStatus.INACTIVE,
    });

    const userGroups = await getUserGroups({ userId: newUser.id });
    expect(userGroups.groups).toHaveLength(2);
    expect(
      userGroups.groups.map((userGroup) => userGroup.group.id),
    ).not.toContain(groups[2].id);
  });
});