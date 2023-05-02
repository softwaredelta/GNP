// (c) Delta Software 2023, rights reserved.

import { DataSource } from "typeorm";
import { UserDeliveryEnt } from "../entities/user-delivery.entity";
import { getDataSource } from "../arch/db-client";

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

export async function uploadUserDelivery(
  id: string,
): Promise<UserDeliveryEnt[]> {
  try {
    return [];
  } catch (error) {
    console.error(error);
  }
  return [];
}
