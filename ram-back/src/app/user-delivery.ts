// (c) Delta Software 2023, rights reserved.

import { DataSource } from "typeorm";
import { UserDeliveryEnt } from "../entities/user-delivery";
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

export async function getUserDelivery(
  id: string,
): Promise<{ userDelivery: UserDeliveryEnt; error?: FileError }> {
  const deliveryId: string = id;
  const ds: DataSource = await getDataSource();
  const userDelivery = await ds.manager.findOne(UserDeliveryEnt, {
    where: { deliveryId },
    relations: ["user", "delivery"],
  });
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

// export async function updateUserDelivery(id: string): Promise<UserDeliveryEnt[]> {
//     const ds: DataSource = await getDataSource();
//     const deliveryId: string = id;
//     return [];

//       return ds.manager
//         .find(UserDeliveryEnt, {
//           select: ["user", "delivery"],
//           where: { deliveryId },
//           relations: ["user", "delivery"]
//         })
//         .then((userDelivery: UserDeliveryEnt[]) => {
//           return userDelivery;
//         }).catch((error) => {
//           console.error(error);
//         });
//        console.error(error);
//     }
