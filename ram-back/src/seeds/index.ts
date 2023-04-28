// (c) Delta Software 2023, rights reserved.

import { addUserToGroup, createGroup } from "../app/groups";
import { createUser } from "../app/user";
import { createDelivery, setDeliverieToUser } from "../app/deliveries";
import { StatusUserDelivery } from "../entities/user-delivery.entity";
import { createAssuranceType } from "../app/assuranceType";
import { createSale } from "../app/sale";
import { UserRole } from "../entities/user.entity";

export async function userSeeds() {
  const userData = [
    { email: "regular@delta.tec.mx", roles: [UserRole.REGULAR] },
    { email: "manager@delta.tec.mx", roles: [UserRole.MANAGER] },
    { email: "admin@delta.tec.mx", roles: [UserRole.ADMIN] },
    {
      email: "manager-admin@delta.tec.mx",
      roles: [UserRole.MANAGER, UserRole.ADMIN],
    },
  ];

  const users = await Promise.all(
    userData.map((u) =>
      createUser({ ...u, id: u.email, password: "password" }).then(
        ({ user, error }) => {
          if (error) {
            throw new Error(error);
          }
          return user;
        },
      ),
    ),
  );

  return {
    regular: users[0],
    manager: users[1],
    admin: users[2],
    managerAdmin: users[3],
  };
}

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

    const user2 = await createUser({
      email: "test2@delta.tec.mx",
      password: "test-password-2",
      id: "test-user-2",
    });

    const { regular } = await userSeeds();

    //GROUPS

    const group1 = await createGroup({
      name: "test-group-1",
      imageURL: "https://picsum.photos/300",
    });

    const group2 = await createGroup({
      name: "test-group-2",
      imageURL: "https://picsum.photos/400",
    });

    const group3 = await createGroup({
      name: "test-group-3",
      imageURL: "https://picsum.photos/500",
    });

    //DELIVERIES
    const delivery1 = await createDelivery({
      deliveryName: "test-delivery-1",
      description: "test-description-1",
      idGroup: group1.group.id,
      imageUrl: "https://picsum.photos/300",
    });

    const delivery2 = await createDelivery({
      deliveryName: "test-delivery-2",
      description: "test-description-2",
      idGroup: group1.group.id,
      imageUrl: "https://picsum.photos/400",
    });

    const delivery3 = await createDelivery({
      deliveryName: "test-delivery-3",
      description: "test-description-3",
      idGroup: group2.group.id,
      imageUrl: "https://picsum.photos/400",
    });

    //USER TO GROUPS
    await addUserToGroup({
      userId: user.user.id,
      groupId: group1.group.id,
    });

    await addUserToGroup({
      userId: user2.user.id,
      groupId: group1.group.id,
    });

    await addUserToGroup({
      userId: user.user.id,
      groupId: group2.group.id,
    });

    await addUserToGroup({
      userId: regular.id,
      groupId: group2.group.id,
    });

    await addUserToGroup({
      userId: regular.id,
      groupId: group3.group.id,
    });

    // DELIVERIES TO USERS
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

    await setDeliverieToUser({
      idDeliverie: delivery3.delivery.id,
      idUser: user.user.id,
      dateDelivery: new Date(),
      status: StatusUserDelivery.sending,
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery3.delivery.id,
      idUser: regular.id,
      dateDelivery: new Date(),
      status: StatusUserDelivery.sending,
      fileUrl: "https://picsum.photos/400",
    });
  } catch (e) {
    console.error(e);
  }

  // ASSURANCE TYPES

  await createAssuranceType({
    name: "test-assurance-type-1",
    description: "test-assurance-type-1-description",
    id: "test-at-1",
  });

  await createAssuranceType({
    name: "VIDA",
    description: "Seguros de Vida",
  });

  await createAssuranceType({
    name: "GMM",
    description: "Seguros de Gastos Médicos Mayores",
  });

  await createAssuranceType({
    name: "PYMES",
    description: "Seguros para Pequeñas y Medianas Empresas",
  });

  await createAssuranceType({
    name: "PATRIMONIAL",
    description: "seguros de patrimonio",
  });

  // SALES

  await createSale({
    policyNumber: "423456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Mónica Ayala",
    periodicity: "Anual",
    id: "test-sale4",
    user: {
      id: "manager@delta.tec.mx",
    },
  });

  await createSale({
    policyNumber: "423456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Mónica Ayala",
    periodicity: "Anual",
    id: "test-sale4",
    user: {
      id: "manager@delta.tec.mx",
    },
  });

  await createSale({
    policyNumber: "423456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Mónica Ayala",
    periodicity: "Anual",
    id: "test-sale4",
    user: {
      id: "manager@delta.tec.mx",
    },
  });

  await createSale({
    policyNumber: "223456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Karen López Revisada",
    periodicity: "Mensual",
    id: "test-sale2",
    user: {
      id: "test-user",
    },
    status: "Revisada",
  });

  await createSale({
    policyNumber: "123456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Jordana",
    periodicity: "Mensual",
    id: "test-sale1",
    user: {
      id: "test-user",
    },
  });

  await createSale({
    policyNumber: "123456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Olivia M",
    periodicity: "Mensual",
    id: "test-sale1",
    user: {
      id: "test-user-2",
    },
  });

  await createSale({
    policyNumber: "323456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "400000",
    clientName: "Renato",
    periodicity: "Trimestral",
    id: "test-sale3",
    user: {
      id: "test-user",
    },
  });

  await createSale({
    policyNumber: "423456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Mónica Ayala",
    periodicity: "Anual",
    id: "test-sale4",
    user: {
      id: "test-user",
    },
  });

  await createSale({
    policyNumber: "823456789",
    assuranceType: {
      id: "test-at-1",
    },
    sellDate: new Date("2021-01-01"),
    amountInCents: "200000",
    clientName: "Ian García",
    periodicity: "Anual",
    id: "test-sale5",
    user: {
      id: "test-user",
    },
  });
}
