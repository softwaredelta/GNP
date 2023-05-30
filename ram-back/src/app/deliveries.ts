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

// Obtain a delivery from a group where the deliveryId is the same as the params.deliveryId
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
//Delete link from delivery
export async function deleteLinkDelivery(params: {
  id: string;
}): Promise<{ error?: DeliveryError; reason?: Error }> {
  const ds = await getDataSource();

  await ds.manager.delete(DeliveryLinkEnt, params.id);
  return {};
}

//Update a link from a delivery
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
