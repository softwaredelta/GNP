// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import {
  UserDeliveryEnt,
  StatusUserDelivery,
} from "../entities/user-delivery.entity";

export enum DeliveryError {
  UNHANDLED = "UNHANDLED",
}

export async function createDelivery(params: {
  idGroup: string;
  deliveryName: string;
  description: string;
  imageUrl: string;
}): Promise<{
  delivery: DeliveryEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      ds.manager.create(DeliveryEnt, {
        deliveryName: params.deliveryName,
        description: params.description,
        imageUrl: params.imageUrl,
        groupId: params.idGroup,
      }),
    )
    .then((delivery) => {
      return { delivery };
    })
    .catch((e) => ({
      error: DeliveryError.UNHANDLED,
      errorReason: e,
      delivery: {} as DeliveryEnt,
    }));
}

export async function updateDelivery(params: {
  deliveryId: string;
  deliveryName?: string;
  description?: string;
  imageUrl?: string;
}): Promise<{
  delivery: DeliveryEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  if (!params.deliveryName && !params.description && !params.imageUrl) {
    return {
      delivery: {} as DeliveryEnt,
      error: DeliveryError.UNHANDLED,
      errorReason: new Error("No fields to update"),
    };
  }

  const ds = await getDataSource();
  const query = ds.createQueryBuilder().update(DeliveryEnt);
  (["deliveryName", "description", "imageUrl"] as const).forEach((field) => {
    if (params[field]) {
      query.set({ [field]: params[field] });
    }
  });

  await query.where("id = :id", { id: params.deliveryId }).execute();

  const delivery = await ds.manager.findOne(DeliveryEnt, {
    where: { id: params.deliveryId },
  });
  if (!delivery) {
    return {
      delivery: {} as DeliveryEnt,
      error: DeliveryError.UNHANDLED,
      errorReason: new Error("No delivery found"),
    };
  }

  return { delivery };
}

export async function setDeliverieToUser(params: {
  idUser: string;
  idDeliverie: string;
  dateDelivery: Date;
  status?: string;
  fileUrl: string;
}): Promise<{
  userDelivery: UserDeliveryEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      UserDeliveryEnt,
      ds.manager.create(UserDeliveryEnt, {
        deliveryId: params.idDeliverie,
        userId: params.idUser,
        dateDelivery: params.dateDelivery,
        status: params.status ?? StatusUserDelivery.withoutSending,
        fileUrl: params.fileUrl,
      }),
    )
    .then((userDelivery) => {
      return { userDelivery };
    })
    .catch((e) => ({
      userDelivery: {} as UserDeliveryEnt,
      error: DeliveryError.UNHANDLED,
      errorReason: e,
    }));
}

// Obtain the deliveries from UserDeliveries where the groupId is the same as the params.groupId
// and the userId is the same as the params.userId
export async function getUserDeliveriesbyGroup(params: {
  userId: string;
  groupId: string;
}): Promise<{
  userDeliveries: UserDeliveryEnt[];
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  try {
    const userDeliveries = await ds.manager.find(UserDeliveryEnt, {
      relations: {
        delivery: {
          group: true,
        },
      },
      where: { userId: params.userId, delivery: { groupId: params.groupId } },
    });

    return {
      userDeliveries,
    };
  } catch (e) {
    return {
      error: DeliveryError.UNHANDLED,
      errorReason: e as Error,
      userDeliveries: [],
    };
  }
}

export async function updateDeliveryStatus(params: {
  userId: string;
  deliveryId: string;
  statusChange: boolean;
}): Promise<{ changedDelivery: UserDeliveryEnt }> {
  const db = await getDataSource();

  if (params.statusChange) {
    await db.manager
      .createQueryBuilder()
      .update(UserDeliveryEnt)
      .set({ status: StatusUserDelivery.accepted })
      .where("deliveryId = :id", { id: params.deliveryId })
      .andWhere("userId = :userId", { userId: params.userId })
      .execute();
  } else {
    await db.manager
      .createQueryBuilder()
      .update(UserDeliveryEnt)
      .set({ status: StatusUserDelivery.refused })
      .where("deliveryId = :id", { id: params.deliveryId })
      .andWhere("userId = :userId", { userId: params.userId })
      .execute();
  }

  const changedDelivery = await db.manager.findOne(UserDeliveryEnt, {
    where: { deliveryId: params.deliveryId, userId: params.userId },
  });

  return { changedDelivery: changedDelivery as UserDeliveryEnt };
}

export async function deleteDelivery(params: {
  deliveryId: string;
}): Promise<{ error?: DeliveryError; reason?: Error }> {
  const ds = await getDataSource();

  await ds.manager.delete(DeliveryEnt, params.deliveryId);
  return {};
}
