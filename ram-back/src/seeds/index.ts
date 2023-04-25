// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";
import { createUserDelivery } from "../app/user-delivery";
import { DataSource } from "typeorm";
import { getDataSource } from "../arch/db-client";
import { DeliveryEnt } from "../entities/delivery.entity";

/**
 * Make sure to specify ids so things stay consistent
 */

export async function loadSeeds() {
  try {
    // USERS
    await createUser({
      email: "test@delta.tec.mx",
      password: "test-password",
      id: "test-user",
    });

    await createUser({
      email: "test@delta2.tec.mx",
      password: "test-password2",
      id: "test-user2",
    });

    // GROUPS
    const { group: group, error: group2Error } = await createGroup({
      name: "group",
    });
    if (group2Error) {
      throw new Error(group2Error);
    }

    await addUserToGroup({
      userId: "test-user",
      groupId: group.id,
    });

    await addUserToGroup({
      userId: "test-user2",
      groupId: group.id,
    });
  } catch (e) {
    console.error(e);
  }

  try {
    //GROUP
    await createGroup({
      id: "dfs",
      name: "group 2",
    });
  } catch (e) {
    console.error(e);
  }

  try {
    // GROUP
    await addUserToGroup({
      userId: "test-user",
      groupId: "course-1",
    });
  } catch (e) {
    console.error(e);
  }

  try {
    const ds: DataSource = await getDataSource();
    const delivery: DeliveryEnt = ds.manager.create(DeliveryEnt, {
      id: "test-delivery",
      description: "Delivery test description",
      imageUrl:
        "https://i.pinimg.com/474x/e2/e8/9e/e2e89eb6dd581f7f0a8a05a13675f4d4.jpg",
      userDeliveries: [],
    });
    await ds.manager.save(delivery);
  } catch (error) {
    console.error(error);
  }

  try {
    // User Delivery
    await createUserDelivery({
      userId: "test-user",
      deliveryId: "test-delivery",
      dateDelivery: new Date("2021-09-01"),
      status: "Sin enviar",
      fileUrl: "https://random.imagecdn.app/500/150",
    });
  } catch (error) {
    console.error(error);
  }
}
