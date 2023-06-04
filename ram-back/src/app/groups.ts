// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { GroupUserStatus } from "../entities/group-user.entity";
import { GroupUserEnt } from "../entities/group-user.entity";
import { GroupEnt } from "../entities/group.entity";
import { StatusUserDelivery } from "../entities/user-delivery.entity";
import { DeliveryEnt } from "../entities/delivery.entity";
import { uploadFile } from "./file";
import { UserEnt } from "../entities/user.entity";

export enum GroupError {
  UNHANDLED = "UNHANDLED",
  CONFLICT = "CONFLICT",
  NOT_FOUND = "NOT_FOUND",
}

/**
 * This function deletes a group from a data source and returns an error if there is an issue.
 * @param params - The function `deleteGroup` takes in an object `params` as its parameter. This object
 * has one property `groupId` which is a string representing the ID of the group that needs to be
 * deleted.
 * @returns The function `deleteGroup` returns a Promise that resolves to an empty object `{}` if the
 * deletion of the group with the specified `groupId` is successful. If there is an error during the
 * deletion process, the Promise rejects with an object containing an `error` property set to
 * `GroupError.UNHANDLED` and a `reason` property set to the error that caused the rejection.
 */
export async function deleteGroup(params: {
  groupId: string;
}): Promise<{ error?: GroupError; reason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .delete(GroupEnt, params.groupId)
    .then(() => ({}))
    .catch((e) => {
      return {
        error: GroupError.UNHANDLED,
        reason: e,
      };
    });
}

/**
 * This TypeScript function creates a new group with a given name, description, and image URL, and
 * returns an object containing the created group or an error if there is a conflict or an unhandled
 * error.
 * @param params - The `createGroup` function takes in an object `params` with the following
 * properties: name of type string, description(Optional) of type string, imageUrl(Optional) of type
 * string.
 * @returns The function `createGroup` returns a Promise that resolves to an object with a `group`
 * property that contains a `GroupEnt` object if the group was successfully created, or an `error`
 * property with a value of `GroupError.CONFLICT` if a group with the same name already exists. If
 * there is an unhandled error during the creation of the group, the Promise will reject with
 */
export async function createGroup(params: {
  name: string;
  description?: string;
  imageUrl?: string;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  // check for existing duplicate name
  const existingGroup = await ds.manager.findOne(GroupEnt, {
    where: { name: params.name },
  });
  if (existingGroup) {
    return {
      error: GroupError.CONFLICT,
      group: {} as GroupEnt,
    };
  }

  return ds.manager
    .save(
      ds.manager.create(GroupEnt, {
        name: params.name,
        description: params.description,
        imageUrl: params.imageUrl,
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

/**
 * This function creates a group with a name, description, and image file, and returns a promise with
 * the group object and optional error information.
 * @param params - The `params` object contains the following properties:name of type string, 
 * description(Optional) of type string, imageFile of type `Express.Multer.File`, which is an 
 * interface for files uploaded using the Multer middleware in an Express.js application..
 * @returns The function `createGroupWithFile` returns a Promise that resolves to an object with a
 * `group` property that contains a `GroupEnt` object, and optionally an `error` property of type
 * `GroupError` and an `errorReason` property of type `Error`.
 */
export async function createGroupWithFile(params: {
  name: string;
  description?: string;
  imageFile: Express.Multer.File;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const filename = await uploadFile({ file: params.imageFile });
  return createGroup({
    name: params.name,
    description: params.description,
    imageUrl: filename,
  });
}

/**
 * This function adds a user to a group with an optional status and returns an error if there is one.
 * @param params - The function `addUserToGroup` takes in an object `params` with the following
 * properties: userId of type string, groupId of type string, status(Optional).
 * @returns a Promise that resolves to an object with an optional "error" property of type "GroupError"
 * and an optional "errorReason" property of type "Error". If the Promise resolves successfully, an
 * empty object is returned. If there is an error, the "error" property is set to
 * "GroupError.UNHANDLED" and the "errorReason" property is set to
 */
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

/**
 * This function removes a user from a group and returns an empty object or an error object if there
 * was an issue.
 * @param params - The `params` object contains two properties: userId of type string, groupId of 
 * typoe string.
 * @returns a Promise that resolves to an empty object ({}) if the deletion is successful. If there is
 * an error, it returns an object with an error property set to GroupError.UNHANDLED and an errorReason
 * property set to the caught error.
 */
export async function removeUserFromGroup(params: {
  userId: string;
  groupId: string;
}): Promise<{ error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds
    .createQueryBuilder()
    .delete()
    .from(GroupUserEnt)
    .where("group_id = :groupId", { groupId: params.groupId })
    .andWhere("user_id = :userId", { userId: params.userId })
    .execute()
    .then(() => ({}))
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
    }));
}

/**
 * This function retrieves a list of users belonging to a specific group.
 * @param {string} groupId - The `groupId` parameter is a string that represents the ID of the group
 * for which we want to retrieve the users.
 * @returns an array of UserEnt objects that belong to a specific group, identified by the groupId
 * parameter. The function first retrieves a data source using the getDataSource() function, then uses
 * the data source to query the database for all GroupUserEnt objects that have a groupId matching the
 * provided parameter. Finally, the function maps the resulting array of GroupUserEnt objects to an
 * array of UserEnt
 */
export async function getUsersByGroup(groupId: string): Promise<UserEnt[]> {
  const ds = await getDataSource();

  const groupUsers = await ds.manager.find(GroupUserEnt, {
    where: { groupId },
    relations: ["user"],
  });

  return groupUsers.map((groupUser) => groupUser.user);
}

/**
 * This function adds a delivery to a group and returns an error if there is an issue.
 * @param params - The function `addDeliveryToGroup` takes in an object `params` with two properties:
 * deliveryID of type string, groupID of type string.
 * @returns a Promise that resolves to an empty object ({}) if the delivery is successfully added to
 * the group. If there is an error, it returns an object with an error property set to
 * GroupError.UNHANDLED and an errorReason property set to the error that caused the failure.
 */
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

interface GroupUser {
  group: GroupEnt;
  numberOfDeliveries: number;
  totalDeliveries: number;
}

/**
 * This function retrieves a user's groups and the number of deliveries they have accepted within each
 * group.
 * @param params - The function `getUserGroups` takes in an object `params` with a single property
 * `userId` which is a string representing the ID of the user whose groups are to be retrieved.
 * @returns The function `getUserGroups` returns a Promise that resolves to an object with a `groups`
 * property, which is an array of `GroupUser` objects. If there is an error, the object also includes
 * an `error` property with a value of `GroupError.UNHANDLED`, an `errorReason` property with the error
 * object, and an empty array for `groups`.
 */
export async function getUserGroups(params: {
  userId: string;
}): Promise<{ groups: GroupUser[]; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  try {
    const groupsBase = await ds.manager.find(GroupUserEnt, {
      relations: {
        group: {
          deliveries: {
            userDeliveries: true,
          },
        },
      },
      where: { userId: params.userId },
    });

    const groups = groupsBase.map((group) => {
      const deliveriesTotal = group.group.deliveries.length;
      const deliceriesUser = group.group.deliveries.filter((delivery) =>
        delivery.userDeliveries.some(
          (userDelivery) =>
            userDelivery.userId === params.userId &&
            userDelivery.status === StatusUserDelivery.accepted,
        ),
      ).length;

      const auxGroup: GroupEnt = {
        ...group.group,
        deliveries: [],
      };
      return {
        group: auxGroup,
        numberOfDeliveries: deliceriesUser,
        totalDeliveries: deliveriesTotal,
      };
    });

    return { groups };
  } catch (e) {
    return {
      error: GroupError.UNHANDLED,
      errorReason: e as Error,
      groups: [],
    };
  }
}

export async function updateGroup(params: {
  groupId: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  const existingGroup = await ds.manager.findOne(GroupEnt, {
    where: { id: params.groupId },
  });
  if (!existingGroup) {
    return {
      error: GroupError.NOT_FOUND,
      group: {} as GroupEnt,
    };
  }
  return ds.manager
    .update(GroupEnt, params.groupId, {
      name: params.name,
      description: params.description,
      imageUrl: params.imageUrl,
    })
    .then(async () => {
      const group = await ds.manager.findOneOrFail(GroupEnt, {
        where: { id: params.groupId },
      });
      return { group };
    })
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
      group: {} as GroupEnt,
    }));
}

export async function updateGroupWithFile(params: {
  groupId: string;
  name?: string;
  description?: string;
  imageFile: Express.Multer.File;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const filename = await uploadFile({ file: params.imageFile });
  return updateGroup({
    groupId: params.groupId,
    name: params.name,
    description: params.description,
    imageUrl: filename,
  });
}
