// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { GroupUserStatus } from "../entities/group-user.entity";
import { GroupUserEnt } from "../entities/group-user.entity";
import { GroupEnt } from "../entities/group.entity";
import { StatusUserDelivery } from "../entities/user-delivery.entity";
import { DeliveryEnt } from "../entities/delivery.entity";
import { getS3Api } from "../arch/s3-client";
import path from "path";

export enum GroupError {
  UNHANDLED = "UNHANDLED",
  CONFLICT = "CONFLICT",
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
  imageURL?: string;
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
        imageURL: params.imageURL,
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
  const s3 = await getS3Api();

  const filename: string =
    Date.now() + path.extname(params.imageFile.originalname);
  await s3.putObject(filename, params.imageFile.buffer).catch((e) => {
    return {
      error: GroupError.UNHANDLED,
      errorReason: e,
      group: {} as GroupEnt,
    };
  });
  return createGroup({
    name: params.name,
    description: params.description,
    imageURL: filename,
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
