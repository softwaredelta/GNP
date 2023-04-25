// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";
import { createDelivery, setDeliverieToUser } from "../app/deliveries";

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
      fileUrl: "https://picsum.photos/400",
    });

    const group2 = await createGroup({
      name: "test-group-2",
      image: "https://picsum.photos/500",
    });

    await createDelivery({
      deliveryName: "test-delivery-3",
      description: "test-description-3",
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
}
