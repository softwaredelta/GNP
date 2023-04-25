// (c) Delta Software 2023, rights reserved.

import { In } from "typeorm";
import { getDataSource } from "../arch/db-client";
import { GroupUserStatus } from "../entities/group-user.entity";
import { GroupUserEnt } from "../entities/group-user.entity";
import { GroupEnt } from "../entities/group.entity";
import { DeliveryEnt } from "../entities/delivery.entity";
import { group } from "console";
import { groupRouter } from "../controller/group";

export enum GroupError {
  UNHANDLED = "UNHANDLED",
}

export async function createGroup(params: {
  name: string;
  imageURL: string;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      ds.manager.create(GroupEnt, {
        name: params.name,
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

export async function getUserGroups(params: {
  userId: string;
}): Promise<{ groups: GroupEnt[]; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .find(GroupUserEnt, {
      select: ["groupId", "userId"],
      where: { userId: params.userId },
    })
    .then((groupUsers) => groupUsers.map((groupUser) => groupUser.groupId))
    .then((groupIds) => ds.manager.findBy(GroupEnt, { id: In(groupIds) }))
    .then((groups) => ({ groups }))
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
      groups: [],
    }));
}

// export async function getDeliveryGroups(params: {
//   groupId: string;
// }): Promise<{ deliveries: DeliveryEnt[]; error?: GroupError; errorReason?: Error }> {
//   const ds = await getDataSource();

//   ds.manager.find(GroupDeliveries)

//   return ds.manager
//     .find(DeliveryEnt, {
//       select: ["description", "imageUrl"],
//       where: { groupId: params.groupId},
//     })
//     .then((GroupDeliveries) => GroupDeliveries.map((GroupDelivery) => GroupDelivery.groupId))
//     .then((groupIds) => ds.manager.findBy(DeliveryEnt, { groupId: In(groupIds) }))
//     .then((deliveries) => ({ deliveries }))
//     .catch((e) => ({
//       error: GroupError.UNHANDLED,
//       errorReason: e,
//       deliveries: [],
//     }));
// }
