// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { DeliveryLinkEnt } from "../entities/delivery-link.entity";
import { DeliveryEnt } from "../entities/delivery.entity";
import {
  UserDeliveryEnt,
  StatusUserDelivery,
} from "../entities/user-delivery.entity";
import { getUsersByGroup } from "./groups";
export enum DeliveryError {
  UNHANDLED = "UNHANDLED",
  NOT_FOUND = "NOT_FOUND",
}

/**
 * This function creates a delivery entity with the given parameters and returns it along with any
 * errors that may occur during the process.
 * @param params - The function `createDelivery` takes in an object `params` with the following
 * properties: idGroup of type string, deliveryName of type string, description of type string, 
 * imageUrl of type string, hasDelivery of type string.
 * @returns a Promise that resolves to an object with two properties: "delivery" and "error" (which is
 * optional). If the Promise resolves successfully, the "delivery" property will contain a DeliveryEnt
 * object. If there is an error, the "error" property will contain a DeliveryError value and the
 * "errorReason" property will contain an Error object.
 */
export async function createDelivery(params: {
  idGroup: string;
  deliveryName: string;
  description: string;
  imageUrl: string;
  hasDelivery?: string;
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
        hasDelivery: params.hasDelivery || "true",
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

/**
 * This function creates a delivery link with the given parameters and returns a promise with the
 * created link or an error.
 * @param params - The function `createLinkDelivery` takes in an object `params` with three properties:
 * deliveryId of type string, link of type string, name of type string.
 * @returns The function `createLinkDelivery` returns a Promise that resolves to an object with two
 * properties: `link` and `error` (optional). If the function is successful, the `link` property will
 * contain a `DeliveryLinkEnt` object. If there is an error, the `error` property will contain a
 * `DeliveryError` enum value and the `errorReason` property will contain the
 */
export async function createLinkDelivery(params: {
  deliveryId: string;
  link: string;
  name: string;
}): Promise<{
  link: DeliveryLinkEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      ds.manager.create(DeliveryLinkEnt, {
        deliveryId: params.deliveryId,
        link: params.link,
        name: params.name,
      }),
    )
    .then((link) => {
      return { link };
    })
    .catch((e) => ({
      error: DeliveryError.UNHANDLED,
      errorReason: e,
      link: {} as DeliveryLinkEnt,
    }));
}

/**
 * This is an async function that updates a delivery entity with the given parameters and returns the
 * updated delivery entity or an error if it fails.
 * @param params - The `params` object contains the following properties: deliveryId of type string, 
 * deliveryName of type string, description of type string, imageUrl of type string, hasDelivery
 * of type string.
 * @returns a Promise that resolves to an object with a `delivery` property that contains a
 * `DeliveryEnt` object and an optional `error` property of type `DeliveryError` and an optional
 * `errorReason` property of type `Error`.
 */
export async function updateDelivery(params: {
  deliveryId: string;
  deliveryName?: string;
  description?: string;
  imageUrl?: string;
  hasDelivery?: string;
}): Promise<{
  delivery: DeliveryEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();
  const existingDelivery = await ds.manager.findOne(DeliveryEnt, {
    where: { id: params.deliveryId },
  });

  if (!existingDelivery) {
    return {
      error: DeliveryError.NOT_FOUND,
      delivery: {} as DeliveryEnt,
    };
  }

  if (
    !params.deliveryName &&
    !params.description &&
    !params.imageUrl &&
    !params.hasDelivery
  )
    return {
      error: DeliveryError.NOT_FOUND,
      delivery: {} as DeliveryEnt,
    };

  return ds.manager
    .update(DeliveryEnt, params.deliveryId, {
      deliveryName: params.deliveryName,
      description: params.description,
      imageUrl: params.imageUrl,
      hasDelivery: params.hasDelivery,
    })
    .then(async () => {
      const delivery = await ds.manager.findOneOrFail(DeliveryEnt, {
        where: { id: params.deliveryId },
      });
      if (delivery) return { delivery };
      else
        return { delivery: {} as DeliveryEnt, error: DeliveryError.NOT_FOUND };
    })
    .catch((e) => ({
      error: DeliveryError.UNHANDLED as DeliveryError,
      errorReason: e as Error,
      delivery: {} as DeliveryEnt,
    }));
}

/**
 * This function sets a delivery to all users in a group and returns an array of objects containing
 * information about the user delivery and any errors that occurred.
 * @param params - The `setDeliveryToAllUsers` function takes in an object `params` with the following
 * properties: idGroup of type string, idDelivery of type string, dateDelivery of type Date, status 
 * of type string, fileUrl of type string.
 * @returns a Promise that resolves to an array of objects. Each object in the array contains a
 * `userDelivery` property which is an instance of the `UserDeliveryEnt` class, and may also contain an
 * `error` property which is an enum value from the `DeliveryError` enum, and an `errorReason` property
 * which is an instance of the `Error` class.
 */
export async function setDeliveryToAllUsers(params: {
  idGroup: string;
  idDelivery: string;
  dateDelivery: Date;
  status?: string;
  fileUrl: string;
}): Promise<
  Array<{
    userDelivery: UserDeliveryEnt;
    error?: DeliveryError;
    errorReason?: Error;
  }>
> {
  const ds = await getDataSource();
  const { idGroup, idDelivery, dateDelivery, status, fileUrl } = params;
  const groupUsers = await getUsersByGroup(idGroup);

  try {
    return await ds.manager.transaction(async (transactionalEntityManager) => {
      const promises = groupUsers.map(async (user) => {
        const userDelivery = ds.manager.create(UserDeliveryEnt, {
          deliveryId: idDelivery,
          userId: user.id,
          dateDelivery,
          status: status ?? StatusUserDelivery.withoutSending,
          fileUrl,
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

/**
 * This function sets a delivery to a user and returns the user delivery entity along with any errors
 * encountered.
 * @param params - The function `setDeliverieToUser` takes in an object `params` with the following
 * properties: idUser of type string, idDelivery of type string, dateDelivery of type Date, status, 
 * fileUrl of type string.
 * @returns a Promise that resolves to an object with two properties: "userDelivery" and "error" (which
 * is optional). The "userDelivery" property contains an instance of the "UserDeliveryEnt" entity that
 * was saved to the database, while the "error" property contains an error code (of the "DeliveryError"
 * enum) if an error occurred during the save operation.
 */
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

/**
 * This function retrieves user deliveries based on the user ID and group ID parameters.
 * @param params - The function `getUserDeliveriesbyGroup` takes in an object `params` with two
 * properties: userId of type string, groupId of type string.
 * @returns an object with two properties: "userDeliveries" and "error" (optional). "userDeliveries" is
 * an array of UserDeliveryEnt objects that match the given parameters. If there is an error, "error"
 * will be set to a DeliveryError enum value and "errorReason" will contain the error object. If there
 * is no error, "error
 */
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

/**
 * The code exports two async functions, one for updating the delivery status and one for deleting a
 * delivery.
 * @param params - The parameters for the two functions are as follows: userId of type string, 
 * deliveryId of type string, statusChange of type boolean.
 * @returns The `updateDeliveryStatus` function returns an object with a property `changedDelivery`
 * which is of type `UserDeliveryEnt`. The `deleteDelivery` function returns an object with an optional
 * property `error` of type `DeliveryError` and an optional property `reason` of type `Error`.
 */
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

/**
 * This function deletes a delivery from a data source using its ID.
 * @param params - The function `deleteDelivery` takes in an object `params` with a single property
 * `deliveryId` which is a string representing the ID of the delivery to be deleted.
 * @returns An empty object is being returned.
 */
export async function deleteDelivery(params: {
  deliveryId: string;
}): Promise<{ error?: DeliveryError; reason?: Error }> {
  const ds = await getDataSource();

  await ds.manager.delete(DeliveryEnt, params.deliveryId);
  return {};
}

/**
 * This function retrieves a delivery group based on a delivery ID and returns it along with any errors
 * encountered.
 * @param params - The function `getDeliveryGroup` takes in an object `params` with a single property
 * `deliveryId` which is a string representing the ID of a delivery.
 * @returns a Promise that resolves to an object with the following properties:
 * - `delivery`: a `DeliveryEnt` object retrieved from the data source.
 * - `error` (optional): a `DeliveryError` enum value indicating the type of error that occurred during
 * the function execution, if any.
 * - `errorReason` (optional): an `Error` object containing more information about the error
 */
export async function getDeliveryGroup(params: {
  deliveryId: string;
}): Promise<{
  delivery: DeliveryEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();

  try {
    const delivery = await ds.manager.findOne(DeliveryEnt, {
      relations: {
        deliveryLinks: {
          delivery: false,
        },
        userDeliveries: {
          delivery: false,
        },
      },
      where: { id: params.deliveryId },
    });

    return { delivery: delivery as DeliveryEnt };
  } catch (e) {
    return {
      error: DeliveryError.UNHANDLED,
      errorReason: e as Error,
      delivery: {} as DeliveryEnt,
    };
  }
}

/**
 * This TypeScript function deletes a delivery link from a data source based on the provided ID.
 * @param params - The function `deleteLinkDelivery` takes in a single parameter `params` which is an
 * object with a required property `id` of type string. This `id` is used to identify the delivery link
 * that needs to be deleted. The function returns a Promise that resolves to an empty object or an
 * @returns An empty object is being returned.
 */
export async function deleteLinkDelivery(params: {
  id: string;
}): Promise<{ error?: DeliveryError; reason?: Error }> {
  const ds = await getDataSource();

  await ds.manager.delete(DeliveryLinkEnt, params.id);
  return {};
}

/**
 * This is an async function that updates a delivery link's name and/or link and returns the updated
 * link or an error if it is not found or an unhandled error occurs.
 * @param params - The `params` object contains three properties: id of type string, link(Optional) 
 * of type string, name(Optional) of type string.
 * @returns a Promise that resolves to an object with a `link` property that contains a
 * `DeliveryLinkEnt` object and may also contain an `error` property of type `DeliveryError` and an
 * `errorReason` property of type `Error`.
 */
export async function updateLinkDelivery(params: {
  id: string;
  link?: string;
  name?: string;
}): Promise<{
  link: DeliveryLinkEnt;
  error?: DeliveryError;
  errorReason?: Error;
}> {
  const ds = await getDataSource();
  const existingLink = await ds.manager.findOne(DeliveryLinkEnt, {
    where: { id: params.id },
  });

  if (!existingLink) {
    return {
      error: DeliveryError.NOT_FOUND,
      link: {} as DeliveryLinkEnt,
    };
  }

  if (!params.link && !params.name)
    return {
      error: DeliveryError.NOT_FOUND,
      link: {} as DeliveryLinkEnt,
    };

  return ds.manager
    .update(DeliveryLinkEnt, params.id, {
      name: params.name,
      link: params.link,
    })
    .then(async () => {
      const link = await ds.manager.findOneOrFail(DeliveryLinkEnt, {
        where: { id: params.id },
      });
      if (link) return { link };
      else
        return { link: {} as DeliveryLinkEnt, error: DeliveryError.NOT_FOUND };
    })
    .catch((e) => ({
      error: DeliveryError.UNHANDLED as DeliveryError,
      errorReason: e as Error,
      link: {} as DeliveryLinkEnt,
    }));
}
