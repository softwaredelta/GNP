// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { GroupUserStatus } from "../entities/group-user.entity";
import { GroupUserEnt } from "../entities/group-user.entity";
import { GroupEnt } from "../entities/group.entity";
import { StatusUserDelivery } from "../entities/user-delivery.entity";
import { DeliveryEnt } from "../entities/delivery.entity";
import { uploadFile } from "./file";
import { UserEnt } from "../entities/user.entity";

export enum GroupError {
  UNHANDLED = "UNHANDLED",
  CONFLICT = "CONFLICT",
  NOT_FOUND = "NOT_FOUND",
}

export async function deleteGroup(params: {
  groupId: string;
}): Promise<{ error?: GroupError; reason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .delete(GroupEnt, params.groupId)
    .then(() => ({}))
    .catch((e) => {
      return {
        error: GroupError.UNHANDLED,
        reason: e,
      };
    });
}

export async function createGroup(params: {
  name: string;
  description?: string;
  imageUrl?: string;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  // check for existing duplicate name
  const existingGroup = await ds.manager.findOne(GroupEnt, {
    where: { name: params.name },
  });
  if (existingGroup) {
    return {
      error: GroupError.CONFLICT,
      group: {} as GroupEnt,
    };
  }

  return ds.manager
    .save(
      ds.manager.create(GroupEnt, {
        name: params.name,
        description: params.description,
        imageUrl: params.imageUrl,
      }),
    )
    .then((group) => {
      return { group };
    })
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
      group: {} as GroupEnt,
    }));
}

export async function createGroupWithFile(params: {
  name: string;
  description?: string;
  imageFile: Express.Multer.File;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const filename = await uploadFile({ file: params.imageFile });
  return createGroup({
    name: params.name,
    description: params.description,
    imageUrl: filename,
  });
}

export async function addUserToGroup(params: {
  userId: string;
  groupId: string;
  status?: GroupUserStatus;
}): Promise<{ error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      GroupUserEnt,
      ds.manager.create(GroupUserEnt, {
        groupId: params.groupId,
        userId: params.userId,
        status: params.status ?? GroupUserStatus.ACTIVE,
      }),
    )
    .then(() => ({}))
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
    }));
}

export async function removeUserFromGroup(params: {
  userId: string;
  groupId: string;
}): Promise<{ error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds
    .createQueryBuilder()
    .delete()
    .from(GroupUserEnt)
    .where("group_id = :groupId", { groupId: params.groupId })
    .andWhere("user_id = :userId", { userId: params.userId })
    .execute()
    .then(() => ({}))
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
    }));
}

export async function getUsersByGroup(groupId: string): Promise<UserEnt[]> {
  const ds = await getDataSource();

  const groupUsers = await ds.manager.find(GroupUserEnt, {
    where: { groupId },
    relations: ["user"],
  });

  return groupUsers.map((groupUser) => groupUser.user);
}

export async function addDeliveryToGroup(params: {
  deliveryID: string;
  groupID: string;
}): Promise<{ error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      DeliveryEnt,
      ds.manager.create(DeliveryEnt, {
        id: params.deliveryID,
        groupId: params.groupID,
      }),
    )
    .then(() => ({}))
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
    }));
}

interface GroupUser {
  group: GroupEnt;
  numberOfDeliveries: number;
  totalDeliveries: number;
}

export async function getUserGroups(params: {
  userId: string;
}): Promise<{ groups: GroupUser[]; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  try {
    const groupsBase = await ds.manager.find(GroupUserEnt, {
      relations: {
        group: {
          deliveries: {
            userDeliveries: true,
          },
        },
      },
      where: { userId: params.userId },
    });

    const groups = groupsBase.map((group) => {
      const deliveriesTotal = group.group.deliveries.length;
      const deliceriesUser = group.group.deliveries.filter((delivery) =>
        delivery.userDeliveries.some(
          (userDelivery) =>
            userDelivery.userId === params.userId &&
            userDelivery.status === StatusUserDelivery.accepted,
        ),
      ).length;

      const auxGroup: GroupEnt = {
        ...group.group,
        deliveries: [],
      };
      return {
        group: auxGroup,
        numberOfDeliveries: deliceriesUser,
        totalDeliveries: deliveriesTotal,
      };
    });

    return { groups };
  } catch (e) {
    return {
      error: GroupError.UNHANDLED,
      errorReason: e as Error,
      groups: [],
    };
  }
}

export async function updateGroup(params: {
  groupId: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  const existingGroup = await ds.manager.findOne(GroupEnt, {
    where: { id: params.groupId },
  });
  if (!existingGroup) {
    return {
      error: GroupError.NOT_FOUND,
      group: {} as GroupEnt,
    };
  }
  return ds.manager
    .update(GroupEnt, params.groupId, {
      name: params.name,
      description: params.description,
      imageUrl: params.imageUrl,
    })
    .then(async () => {
      const group = await ds.manager.findOneOrFail(GroupEnt, {
        where: { id: params.groupId },
      });
      return { group };
    })
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
      group: {} as GroupEnt,
    }));
}

export async function updateGroupWithFile(params: {
  groupId: string;
  name?: string;
  description?: string;
  imageFile: Express.Multer.File;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const filename = await uploadFile({ file: params.imageFile });
  return updateGroup({
    groupId: params.groupId,
    name: params.name,
    description: params.description,
    imageUrl: filename,
  });
}
