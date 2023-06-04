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

/**
 * This function creates a new user delivery record in a data source using the provided user delivery
 * data.
 * @param userDeliveryData - Partial<UserDeliveryEnt> is a TypeScript type that defines an object with
 * properties that match the properties of the UserDeliveryEnt interface, but all of them are optional.
 * This means that when calling the createUserDelivery function, you can pass in an object that only
 * contains some of the properties of UserDeliveryEnt
 * @returns a Promise that resolves to a UserDeliveryEnt object.
 */
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

/**
 * This function retrieves all user deliveries associated with a given delivery ID from a data source
 * and returns them in an object, along with an optional error if no deliveries are found.
 * @param {string} id - The id parameter is a string that represents the delivery id for which we want
 * to retrieve all user deliveries.
 * @returns A Promise that resolves to an object containing an array of UserDeliveryEnt objects with
 * the specified deliveryId and their associated user and delivery entities, or an empty array and a
 * FileError if no matching UserDeliveryEnt objects are found.
 */
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

/**
 * This function retrieves a user's delivery information from a data source based on the delivery ID
 * and user ID.
 * @param {string} id - The ID of the delivery that the user is associated with.
 * @param {string} userId - The `userId` parameter is a string representing the ID of the user for whom
 * we want to retrieve delivery information.
 * @returns A Promise that resolves to an object containing either the `userDelivery` object or an
 * `error` property indicating that the file was not found.
 */
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

/**
 * This function assigns a user to all deliveries in a specified group and returns an array of objects
 * containing information about the user delivery and any errors encountered.
 * @param params - The function `setUserToAllDeliveries` takes in an object `params` with two
 * properties: groupId of type string, userId of type string.
 * @returns a Promise that resolves to an array of objects. Each object in the array contains a
 * `userDelivery` property which is an instance of the `UserDeliveryEnt` class, and may also contain an
 * `error` property which is an enum value from the `DeliveryError` enum, and an `errorReason` property
 * which is an instance of the `Error` class. The
 */
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
