// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";
import { UserDeliveryEnt, StatusUserDelivery } from "../entities/user-delivery";

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

export interface UserDeliveryResponse {
  deliveryId: string;
  dateDelivery: Date;
  status: string;
  fileUrl: string;
  deliveryName: string;
  description: string;
  imageUrl: string;
  groupName: string;
}
// Obtain the deliveries from UserDeliveries where the groupId is the same as the params.groupId
// and the userId is the same as the params.userId
export async function getUserDeliveriesbyGroup(params: {
  userId: string;
  groupId: string;
}): Promise<{
  userDeliveries: UserDeliveryResponse[];
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  try {
    const userDeliveriesBase = await ds.manager.find(UserDeliveryEnt, {
      relations: {
        delivery: {
          group: true,
        },
      },
      where: { userId: params.userId, delivery: { groupId: params.groupId } },
    });

    const userDeliveries: UserDeliveryResponse[] = userDeliveriesBase.map(
      (userDelivery): UserDeliveryResponse => ({
        deliveryId: userDelivery.deliveryId,
        dateDelivery: userDelivery.dateDelivery,
        status: userDelivery.status,
        fileUrl: userDelivery.fileUrl,
        deliveryName: userDelivery.delivery.deliveryName,
        description: userDelivery.delivery.description,
        imageUrl: userDelivery.delivery.imageUrl,
        groupName: userDelivery.delivery.group.name,
      }),
    );

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
