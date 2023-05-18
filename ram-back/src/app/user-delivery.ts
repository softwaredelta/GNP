// (c) Delta Software 2023, rights reserved.

import { DataSource } from "typeorm";
import {
  StatusUserDelivery,
  UserDeliveryEnt,
} from "../entities/user-delivery.entity";
import { getDataSource } from "../arch/db-client";
import { DeliveryError } from "./deliveries";
import { DeliveryEnt } from "../entities/delivery.entity";

export enum FileError {
  INVALID_FORMAT = "INVALID_FORMAT",
  TO_BIG = "TO_BIG",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
}

export async function createUserDelivery(
  userDeliveryData: Partial<UserDeliveryEnt>,
): Promise<UserDeliveryEnt> {
  const ds: DataSource = await getDataSource();
  const userDelivery: UserDeliveryEnt = ds.manager.create(
    UserDeliveryEnt,
    userDeliveryData,
  ) as UserDeliveryEnt;
  return ds.manager.save(userDelivery);
}

export async function getAllUserDeliveries(
  id: string,
): Promise<{ userDeliveries: UserDeliveryEnt[]; error?: FileError }> {
  const deliveryId: string = id;
  const ds: DataSource = await getDataSource();
  const userDeliveries: UserDeliveryEnt[] = await ds.manager.find(
    UserDeliveryEnt,
    {
      where: { deliveryId },
      relations: ["user", "delivery"],
    },
  );
  if (userDeliveries) {
    return { userDeliveries };
  } else {
    return {
      userDeliveries: [],
      error: FileError.FILE_NOT_FOUND,
    };
  }
}

export async function getAuthUserDelivery(
  id: string,
  userId: string,
): Promise<{ userDelivery: UserDeliveryEnt; error?: FileError }> {
  const deliveryId: string = id;
  const ds: DataSource = await getDataSource();
  const userDelivery: UserDeliveryEnt | null = await ds.manager.findOne(
    UserDeliveryEnt,
    {
      where: { deliveryId, userId },
      relations: ["user", "delivery"],
    },
  );
  if (userDelivery) {
    return { userDelivery };
  } else {
    return {
      userDelivery: {} as UserDeliveryEnt,
      error: FileError.FILE_NOT_FOUND,
    };
  }
}

export async function setUserToAllDeliveries(params: {
  groupId: string;
  userId: string;
}): Promise<
  Array<{
    userDelivery: UserDeliveryEnt;
    error?: DeliveryError;
    errorReason?: Error;
  }>
> {
  const ds = await getDataSource();
  const { groupId, userId } = params;
  const groupDeliveries = await ds.manager.find(DeliveryEnt, {
    where: {
      groupId: groupId,
    },
  });

  try {
    return await ds.manager.transaction(async (transactionalEntityManager) => {
      const promises = groupDeliveries.map(async (delivery) => {
        const userDelivery = ds.manager.create(UserDeliveryEnt, {
          deliveryId: delivery.id,
          userId: userId,
          dateDelivery: new Date(),
          status: StatusUserDelivery.withoutSending,
          fileUrl: delivery.imageUrl,
        });

        try {
          await transactionalEntityManager.save(userDelivery);
          return { userDelivery };
        } catch (e) {
          return {
            userDelivery: {} as UserDeliveryEnt,
            error: DeliveryError.UNHANDLED,
            errorReason: e as Error,
          };
        }
      });

      return Promise.all(promises);
    });
  } catch (e) {
    return [
      {
        userDelivery: {} as UserDeliveryEnt,
        error: DeliveryError.UNHANDLED,
        errorReason: new Error("Fallo asignando delivery a usuario"),
      },
    ];
  }
}
