// (c) Delta Software 2023, rights reserved.

import { createDelivery, setDeliverieToUser } from "../app/deliveries";
import { addDeliveryToGroup, addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";

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
      imageURL:
        "https://i1.wp.com/kayum.mx/wp-content/uploads/2019/09/logo-GNP.jpeg?fit=3307%2C1686&ssl=1",
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

  } catch (e) {
    console.error(e);
  }
}
