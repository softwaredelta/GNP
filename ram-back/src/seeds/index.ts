// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";
import { createDelivery, setDeliverieToUser } from "../app/deliveries";
import { StatusUserDelivery } from "../entities/user-delivery";

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
      imageURL: "https://picsum.photos/100",
    });
    const delivery1 = await createDelivery({
      deliveryName: "test-delivery-1",
      description: "test-description-1",
      idGroup: group1.group.id,
      imageUrl: "https://picsum.photos/200",
    });

    const delivery2 = await createDelivery({
      deliveryName: "test-delivery-2",
      description: "test-description-2",
      idGroup: group1.group.id,
      imageUrl: "https://picsum.photos/300",
    });

    // GROUPS
    const { group: group, error: group2Error } = await createGroup({
      name: "group",
      imageURL:
        "https://i1.wp.com/kayum.mx/wp-content/uploads/2019/09/logo-GNP.jpeg?fit=3307%2C1686&ssl=1",
    });
    if (group2Error) {
      throw new Error(group2Error);
    }

    await setDeliverieToUser({
      idDeliverie: delivery1.delivery.id,
      idUser: user.user.id,
      dateDelivery: new Date(),
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery2.delivery.id,
      idUser: user.user.id,
      dateDelivery: new Date(),
      status: StatusUserDelivery.sending,
      fileUrl: "https://picsum.photos/400",
    });

    const group2 = await createGroup({
      name: "test-group-2",
      imageURL: "https://picsum.photos/500",
    });

    await createDelivery({
      deliveryName: "test-delivery-3",
      description: "test-description-3",
      idGroup: group2.group.id,
      imageUrl: "https://picsum.photos/500",
    });

    await createGroup({
      name: "test-group-3",
      imageURL: "https://picsum.photos/600",
    });

    await addUserToGroup({
      userId: user.user.id,
      groupId: group1.group.id,
    });

    // Deliveries
    const { delivery: delivery, error: delivery2Error } = await createDelivery({
      description: "test-delivery",
      imageUrl: "https://i.ytimg.com/vi/eDkLz16lmxI/maxresdefault.jpg",
      idGroup: group.id,
    });
    if (delivery2Error) {
      throw new Error(delivery2Error);
    }

    await setDeliverieToUser({
      idDeliverie: delivery.id,
      idUser: "test-user",
      dateDelivery: new Date(),
      status: "Aceptado",
      fileUrl: "https://picsum.photos/400",
    });
    await addUserToGroup({
      userId: user.user.id,
      groupId: group2.group.id,
    });
  } catch (e) {
    console.error(e);
  }
}
