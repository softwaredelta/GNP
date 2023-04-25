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
  user_delivery: UserDeliveryEnt;
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
    .then((user_delivery) => {
      return { user_delivery };
    })
    .catch((e) => ({
      user_delivery: {} as UserDeliveryEnt,
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
  user_deliveries: UserDeliveryEnt[];
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  try {
    const userDeliveries = await ds.manager.find(UserDeliveryEnt, {
      relations: {
        delivery: true,
      },
      where: { userId: params.userId},
    });

    const user_deliveries = userDeliveries.filter((user_delivery) => {
      return (
        user_delivery.userId === params.userId &&
        user_delivery.delivery.groupId === params.groupId
      );
    });

    return { user_deliveries };
  } catch (e) {
    return {
      error: DeliveryError.UNHANDLED,
      errorReason: e as Error,
      user_deliveries: [],
    };
  }
}
