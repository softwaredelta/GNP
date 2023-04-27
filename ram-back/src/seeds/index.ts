// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";
import { createDelivery, setDeliverieToUser } from "../app/deliveries";
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
    const user = await createUser({
      email: "test@delta.tec.mx",
      password: "test-password",
      id: "test-user",
    });
    const group1 = await createGroup({
      name: "test-group-1",
      image: "https://picsum.photos/100",
    });
    const delivery1 = await createDelivery({
      description: "test-delivery-1",
      idGroup: group1.group.id,
      imageUrl: "https://picsum.photos/200",
    });

    const delivery2 = await createDelivery({
      description: "test-delivery-2",
      idGroup: group1.group.id,
      imageUrl: "https://picsum.photos/300",
    });

    await setDeliverieToUser({
      idDeliverie: delivery1.delivery.id,
      idUser: user.user.id,
      dateDelivery: new Date(),
      status: "Aceptado",
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery2.delivery.id,
      idUser: user.user.id,
      dateDelivery: new Date(),
      status: "Rechazado",
      fileUrl: "https://picsum.photos/400",
    });

    const group2 = await createGroup({
      name: "test-group-2",
      image: "https://picsum.photos/500",
    });

    await createDelivery({
      description: "test-delivery-3",
      idGroup: group2.group.id,
      imageUrl: "https://picsum.photos/500",
    });

    await createGroup({
      name: "test-group-3",
      image: "https://picsum.photos/600",
    });

    await addUserToGroup({
      userId: user.user.id,
      groupId: group1.group.id,
    });
    await addUserToGroup({
      userId: user.user.id,
      groupId: group2.group.id,
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
