// (c) Delta Software 2023, rights reserved.

import { DataSource } from "typeorm";
import { setDeliverieToUser } from "../../app/deliveries";
import { createDelivery } from "../../app/deliveries";
import {
  addUserToGroup,
  createGroup,
  createGroupWithFile,
  deleteGroup,
  getUserGroups,
} from "../../app/groups";
import { createUser } from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { DeliveryEnt } from "../../entities/delivery.entity";
import {
  GroupUserEnt,
  GroupUserStatus,
} from "../../entities/group-user.entity";
import { GroupEnt } from "../../entities/group.entity";
import { UserDeliveryEnt } from "../../entities/user-delivery.entity";
import { UserEnt } from "../../entities/user.entity";
import { getS3Api } from "../../arch/s3-client";

describe("app:groups", () => {
  let ds: DataSource;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);
  });

  describe("create", () => {
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

      await ds.manager.find(GroupEnt).then((groups) => {
        expect(groups).toHaveLength(5);
        expect(groups[0].imageURL).toBe("");
      });
    });

    it("uploads file contents successfully", async () => {
      const file = {
        buffer: Buffer.from("file contents"),
        originalname: "file.png",
        encoding: "utf-8",
        mimetype: "image/png",
      } as Express.Multer.File;

      const { group, error } = await createGroupWithFile({
        name: "group",
        description: "description",
        imageFile: file,
      });
      expect(error).toBeUndefined();
      expect(group.imageURL).toMatch(/\d+\.png/);

      const s3 = await getS3Api();
      const fileContents = await s3.getObjectPromise(group.imageURL);
      expect(fileContents.toString()).toBe("file contents");
    });
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

  describe("group delete", () => {
    let group: GroupEnt;
    beforeEach(async () => {
      const { user, error: userError } = await createUser({
        email: "group-test@delta.tec.mx",
        password: "password",
      });
      if (userError) {
        throw new Error(userError);
      }

      const { group: newGroup, error: groupError } = await createGroup({
        name: "test-group-000",
      });
      if (groupError) {
        throw new Error(groupError);
      }

      const { delivery, error: deliveryError } = await createDelivery({
        idGroup: newGroup.id,
        deliveryName: "test-delivery-000",
        description: "test-delivery-000",
        imageUrl: "",
      });
      if (deliveryError) {
        throw new Error(deliveryError);
      }

      await addUserToGroup({
        groupId: newGroup.id,
        userId: user.id,
      });

      await setDeliverieToUser({
        idUser: user.id,
        dateDelivery: new Date(),
        idDeliverie: delivery.id,
        fileUrl: "",
      });

      group = newGroup;
    });

    it("setup is done correctly", async () => {
      const createdGroup = await ds.manager.findOne(GroupEnt, {
        where: { id: group.id },
        relations: {
          groupUsers: true,
          deliveries: {
            userDeliveries: true,
          },
        },
      });

      expect(createdGroup).toBeDefined();
      expect(createdGroup?.groupUsers).toHaveLength(1);
      expect(createdGroup?.deliveries).toHaveLength(1);
      expect(createdGroup?.deliveries[0].userDeliveries).toHaveLength(1);
    });

    it("handles non-existing group", async () => {
      const { error } = await deleteGroup({ groupId: "some-bad-id" });
      expect(error).toBeUndefined();
    });

    it("deletes group", async () => {
      await deleteGroup({ groupId: group.id });

      const deletedGroup = await ds.manager.findOne(GroupEnt, {
        where: { id: group.id },
      });

      expect(deletedGroup).toBeNull();
    });

    it("deletes group image file", async () => {
      await deleteGroup({ groupId: group.id });

      // FIXME
    });

    it("deletes group deliveries", async () => {
      await deleteGroup({ groupId: group.id });

      const deletedDeliveries = await ds.manager.find(DeliveryEnt);
      expect(deletedDeliveries).toHaveLength(0);
    });

    it("deletes group deliveries files", async () => {
      await deleteGroup({ groupId: group.id });

      // FIXME
    });

    it("deletes group user-deliveries", async () => {
      await deleteGroup({ groupId: group.id });

      const deletedUserDeliveries = await ds.manager.find(UserDeliveryEnt);
      expect(deletedUserDeliveries).toHaveLength(0);
    });

    it("deletes group user-deliveries files", async () => {
      await deleteGroup({ groupId: group.id });

      // FIXME
    });

    it("deletes group user associations", async () => {
      await deleteGroup({ groupId: group.id });

      const deletedGroupUsers = await ds.manager.find(GroupUserEnt);
      expect(deletedGroupUsers).toHaveLength(0);
    });

    it("does not delete users", async () => {
      await deleteGroup({ groupId: group.id });

      const users = await ds.manager.find(UserEnt);
      expect(users).toHaveLength(1);
    });
  });
});
