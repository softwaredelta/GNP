// (c) Delta Software 2023, rights reserved.

import { createAssuranceType } from "../app/assuranceType";
import {
  createDelivery,
  createLinkDelivery,
  updateDelivery,
} from "../app/deliveries";
import { addUserToGroup, createGroup } from "../app/groups";
import { createProspect } from "../app/prospect";
import { createSale } from "../app/sale";
import { createStatus } from "../app/status";
import { UserError, addLink, createUser } from "../app/user";
import { setUserToAllDeliveries } from "../app/user-delivery";
import { StatusNames } from "../entities/status.entity";
import { UserRole } from "../entities/user.entity";

/**
 * Make sure admin user is always available.
 * Admin user has access to ALL authenticated endpoints.
 */
export async function adminSeeds() {
  const { error } = await createUser({
    email: "admin@delta.tec.mx",
    password: process.env.ADMIN_PASSWORD || "password",
    roles: [UserRole.ADMIN],
  });

  if (error === UserError.USER_EXISTS) {
    console.warn("Admin user already exists");
  } else if (error) {
    console.error("Error creating admin user", error);
  } else {
    console.info("Admin user created");
  }
}

export async function userSeeds() {
  const userData = [
    {
      email: "regular@delta.tec.mx",
      roles: [UserRole.REGULAR],
      name: "Regular",
      lastName: "User",
    },
    {
      email: "manager@delta.tec.mx",
      roles: [UserRole.MANAGER],
      name: "Manager",
      lastName: "User",
    },
    {
      email: "manager-admin@delta.tec.mx",
      roles: [UserRole.MANAGER, UserRole.ADMIN],
    },
  ];

  const users = await Promise.all(
    userData.map((u) =>
      createUser({ ...u, password: "password" }).then(({ user, error }) => {
        if (error) {
          throw new Error(error);
        }
        return user;
      }),
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
      email: "luisarriola@ram.mx",
      name: "Luis",
      lastName: "Arriola",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    const agent1 = await createUser({
      email: "valeriaherrera@ram.mx",
      name: "Valeria",
      lastName: "Herrera",
      password: "password",
      roles: [UserRole.REGULAR],
    });

    const userRegular = await createUser({
      email: "regular@ram.mx",
      name: "Francisco",
      lastName: "Herrera",
      password: "password",
      roles: [UserRole.REGULAR],
    });

    await createUser({
      email: "lauradiaz@ram.mx",
      name: "Laura",
      lastName: "Díaz",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "danielagomez@ram.mx",
      name: "Daniela",
      lastName: "Gómez",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "armandocamargo@ram.mx",
      name: "Armando",
      lastName: "Camargo",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "karladíaz@ram.mx",
      name: "Karla",
      lastName: "Díaz",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    const agent2 = await createUser({
      email: "marthaarriola@ram.mx",
      name: "Martha",
      lastName: "Arriola",
      password: "password",
      roles: [UserRole.REGULAR],
    });

    const agent3 = await createUser({
      email: "oliviahernandez@ram.mx",
      name: "Olivia",
      lastName: "Hernández",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "carlosarmijo@ram.mx",
      name: "Carlos",
      lastName: "Armijo",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "miriamcontreras@ram.mx",
      name: "Miriam",
      lastName: "Contreras",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "itzeldiaz@ram.mx",
      name: "Itzel",
      lastName: "Díaz",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "carmenbarbosa@ram.mx",
      name: "Carmen",
      lastName: "Barbosa",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "yarelygarcia@ram.mx",
      name: "Yarely",
      lastName: "García",
      password: "password",
      roles: [UserRole.MANAGER],
    });

    const { regular } = await userSeeds();

    //GROUPS

    const group1 = await createGroup({
      name: "Noveles (Inducción)",
      imageUrl:
        "https://media.licdn.com/dms/image/C5622AQF-LKP9Jny8dQ/feedshare-shrink_2048_1536/0/1656612233694?e=1684972800&v=beta&t=9MbCq9kv7-wpB45fnLCMbqChbeRAtIbf3HefLN65EPI",
    });

    const groupNovelWeek1 = await createGroup({
      name: "Noveles (Semana 1)",
      imageUrl:
        "https://media.istockphoto.com/id/1420107347/photo/start-written-on-starting-line-on-of-running-track-of-sports-field.jpg?b=1&s=170667a&w=0&k=20&c=BWUlJ_xLHqczgTWek2hzHPD0IwFi3AvjB2DXPtoKw8I=",
    });

    const groupNovelWeek2 = await createGroup({
      name: "Noveles (Semana 2)",
      imageUrl:
        "https://cdn.pixabay.com/photo/2017/11/27/07/02/time-2980690__340.jpg",
    });

    const groupNovelWeek3 = await createGroup({
      name: "Noveles (Semana 3)",
      imageUrl:
        "https://media.istockphoto.com/id/1255703247/es/foto/una-mujer-haciendo-y-mostrando-el-signo-de-mano-n%C3%BAmero-tres.jpg?s=612x612&w=0&k=20&c=8c0VI8divs47gO0Ui8XMhSAdtJMgPeUZFLEV4VvUkFg=",
    });

    const groupNovelWeek4 = await createGroup({
      name: "Noveles (Semana 4)",
      imageUrl:
        "https://corredordigital.mx/wp-content/uploads/2021/03/133101280_10164932258730650_5667144890225799800_o.png",
    });

    const groupNovelWeek5 = await createGroup({
      name: "Noveles (Semana 5)",
      imageUrl:
        "https://media.istockphoto.com/id/1390194789/photo/hands-of-an-asian-woman-studying-in-a-coworking-space.jpg?b=1&s=170667a&w=0&k=20&c=IFGwTyl9w2cxmpzytoRC23DOzQVLLixtf_D0nXCwrgs=",
    });

    //DELIVERIES
    const delivery = await createDelivery({
      deliveryName: "Creación de YouCanBookMe",
      description:
        "Los agentes tendrán un calendario en donde podrán ver sus citas y espacios disponibles",
      idGroup: group1.group.id,
      imageUrl:
        "https://osbsoftware.com.br/upload/fabricante/you%20canbook%20me.png",
    });

    await createLinkDelivery({
      link: "https://www.youtube.com",
      deliveryId: delivery.delivery.id,
      name: "Youtube",
    });

    await createLinkDelivery({
      link: "https://www.google.com",
      deliveryId: delivery.delivery.id,
      name: "Google",
    });

    await createLinkDelivery({
      link: "https://www.youtube.com",
      deliveryId: delivery.delivery.id,
      name: "Youtube",
    });

    await createLinkDelivery({
      link: "https://www.google.com",
      deliveryId: delivery.delivery.id,
      name: "Google",
    });

    const delivery2 = await createDelivery({
      deliveryName: "Creación de YouCanBookMe",
      description:
        "Los agentes tendrán un calendario en donde podrán ver sus citas y espacios disponibles",
      idGroup: group1.group.id,
      imageUrl:
        "https://osbsoftware.com.br/upload/fabricante/you%20canbook%20me.png",
    });

    await createLinkDelivery({
      link: "https://www.youtube.com",
      deliveryId: delivery2.delivery.id,
      name: "Youtube",
    });

    await createLinkDelivery({
      link: "https://www.google.com",
      deliveryId: delivery2.delivery.id,
      name: "Google",
    });

    const delivery3 = await createDelivery({
      deliveryName: "Segumiento de coaching",
      description: "Semáforo para una gestión eficaz del tiempo",
      idGroup: group1.group.id,
      imageUrl:
        "https://efesalud.com/wp-content/uploads/2021/10/EPA-Frank-Rumpenhorst.jpg",
    });

    await createLinkDelivery({
      link: "https://www.youtube.com",
      deliveryId: delivery3.delivery.id,
      name: "Youtube",
    });

    await createLinkDelivery({
      link: "https://www.google.com",
      deliveryId: delivery3.delivery.id,
      name: "Google",
    });

    const delivery4 = await createDelivery({
      deliveryName: "Llenado de PP200",
      description: "El agente tiene 200 prospectos en tabla de prospectos",
      idGroup: groupNovelWeek4.group.id,
      imageUrl:
        "https://www.mailclick.com.mx/wp-content/uploads/seguimiento-de-prospecto-twt.png",
    });

    await createLinkDelivery({
      link: "https://www.youtube.com",
      deliveryId: delivery4.delivery.id,
      name: "Youtube",
    });

    await createLinkDelivery({
      link: "https://www.google.com",
      deliveryId: delivery4.delivery.id,
      name: "Google",
    });

    const deliveryExample = await createDelivery({
      deliveryName: "Primera cita con prospecto",
      description: "Seguimiento de primera cita con prospecto",
      idGroup: groupNovelWeek5.group.id,
      imageUrl:
        "https://scorganizacional.com/images/blog/seguimiento-y-mejora.jpg",
    });

    await createDelivery({
      deliveryName: "Junta de bienvenida nuevos candidatos",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek1.group.id,
      imageUrl:
        "https://media.istockphoto.com/id/1183724539/es/foto/dos-personas-d%C3%A1ndose-la-mano.jpg?b=1&s=170667a&w=0&k=20&c=174x3mlH87mnG2s19FMj1Q59BcCqUs6wlUoKGG3EN-w=",
    });
    await createDelivery({
      deliveryName: "Entrega del kit de arranque",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek1.group.id,
      imageUrl:
        "https://institutodc.com.br/wp-content/uploads/2017/08/entrega-documentos.jpg",
    });
    await createDelivery({
      deliveryName: "Firma de comrpomisos inducción y arranque",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek1.group.id,
      imageUrl:
        "https://i2.wp.com/www.sonria.com/wp-content/uploads/2019/08/compromiso-baja.jpg?fit=1766%2C1179&ssl=1",
    });
    await createDelivery({
      deliveryName: "Entrega de documentos",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek1.group.id,
      imageUrl: "http://www.ferravi.com/img/entrega-documentos.jpg",
    });
    await createDelivery({
      deliveryName: "50 prospectos vaciados en pp200",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek1.group.id,
      imageUrl:
        "https://www.futuredesigngroup.com/blog/wp-content/uploads/2020/08/Sales-Funnel-FDG-1.png",
    });

    await createDelivery({
      deliveryName: "Memorizar guiones telefónicos",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek2.group.id,
      imageUrl:
        "https://us.123rf.com/450wm/kasto/kasto1504/kasto150400117/39021587-hombre-de-negocios-haciendo-una-presentaci%C3%B3n-en-la-oficina-ejecutivo-de-la-empresa-la-entrega-de.jpg",
    });
    await createDelivery({
      deliveryName: "Dominar presentacion primera cita",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek2.group.id,
      imageUrl:
        "https://cdn.pixabay.com/photo/2017/05/28/16/55/coffee-2351436__340.jpg",
    });
    await createDelivery({
      deliveryName: "Prospecto pp100",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek2.group.id,
      imageUrl: "https://www.galileo.edu/esec/files/2020/06/006.jpg",
    });
    await createDelivery({
      deliveryName: "Tener instalado su nautilus",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek2.group.id,
      imageUrl:
        "https://images.contentstack.io/v3/assets/blt187521ff0727be24/blt758bc6307b613946/60ee0fd285b04228439613d5/Nautilus_0.jpg",
    });
    await createDelivery({
      deliveryName: "Entrega de documentos para alta prov",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek2.group.id,
      imageUrl:
        "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdW1lbnRvfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    });
    await createDelivery({
      deliveryName: "Pasar sus exámenes con 80% minimo",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek2.group.id,
      imageUrl: "https://wallpaperaccess.com/full/2020044.jpg",
    });

    await createDelivery({
      deliveryName: "Pasar sus exámenes con 80% minimo",
      description: "Lorem ipsum",
      idGroup: groupNovelWeek3.group.id,
      imageUrl: "https://wallpaperaccess.com/full/2020044.jpg",
    });

    await addLink({
      id: deliveryExample.delivery.id,
      name: "Link 1",
      link: "https://www.google.com",
    });

    //USER TO GROUPS
    await addUserToGroup({
      userId: user.user.id,
      groupId: group1.group.id,
    });

    await addUserToGroup({
      userId: userRegular.user.id,
      groupId: group1.group.id,
    });

    await addUserToGroup({
      userId: agent1.user.id,
      groupId: group1.group.id,
    });

    await addUserToGroup({
      userId: user.user.id,
      groupId: groupNovelWeek4.group.id,
    });

    await addUserToGroup({
      userId: userRegular.user.id,
      groupId: groupNovelWeek4.group.id,
    });
    await addUserToGroup({
      userId: regular.id,
      groupId: groupNovelWeek4.group.id,
    });

    await addUserToGroup({
      userId: regular.id,
      groupId: groupNovelWeek5.group.id,
    });

    await addUserToGroup({
      userId: user.user.id,
      groupId: groupNovelWeek1.group.id,
    });
    await addUserToGroup({
      userId: user.user.id,
      groupId: groupNovelWeek2.group.id,
    });
    await addUserToGroup({
      userId: user.user.id,
      groupId: groupNovelWeek3.group.id,
    });

    await setUserToAllDeliveries({
      userId: regular.id,
      groupId: groupNovelWeek5.group.id,
    });

    await updateDelivery({
      deliveryId: deliveryExample.delivery.id,
      hasDelivery: "false",
    });

    // ASSURANCE TYPES

    const { assuranceType: assuranceType } = await createAssuranceType({
      name: "GMM",
      description:
        "El seguro de gastos médicos mayores abarca los gastos de hospitalización, cirugía, medicamentos, estudios clínicos, honorarios médicos, entre otros.",
    });

    const { assuranceType: assuranceType3 } = await createAssuranceType({
      name: "VIDA",
      description: "Seguro de vida",
    });

    const { assuranceType: assuranceType2 } = await createAssuranceType({
      name: "PYMES",
      description: "Seguros para Pequeñas y Medianas Empresas",
    });

    await createAssuranceType({
      name: "PATRIMONIAL",
      description: "Seguros de patrimonio",
    });

    await createAssuranceType({
      name: "AUTOS",
      description: "Seguros de auto",
    });

    // SALES

    await createSale({
      policyNumber: "523456789",
      assuranceTypeId: assuranceType.id,
      paidDate: new Date(),
      yearlyFee: "135000",
      contractingClient: "Eduardo García",
      periodicity: "Anual",
      userId: agent1.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Clara Chia",
      paidFee: "2000",
    });

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: assuranceType2.id,
      paidDate: new Date(),
      yearlyFee: "325000",
      contractingClient: "Juan Pedro Reyes",
      periodicity: "Anual",
      userId: agent1.user.id,

      emissionDate: new Date(),
      insuredCostumer: "Alejandro García",
      paidFee: "5000",
    });

    await createSale({
      policyNumber: "123456789",
      assuranceTypeId: assuranceType3.id,
      paidDate: new Date(),
      yearlyFee: "134000",
      contractingClient: "Enrique Bonilla",
      periodicity: "Anual",
      userId: agent1.user.id,

      emissionDate: new Date(),
      insuredCostumer: "Sofia Martínez",
      paidFee: "1000",
    });

    await createSale({
      policyNumber: "523456789",
      assuranceTypeId: assuranceType.id,
      paidDate: new Date(),
      yearlyFee: "135000",
      contractingClient: "Eduardo García",
      periodicity: "Anual",
      userId: agent2.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Clara Chia",
      paidFee: "2000",
    });

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: assuranceType2.id,
      paidDate: new Date(),
      yearlyFee: "325000",
      contractingClient: "Juan Pedro Reyes",
      periodicity: "Anual",
      userId: agent2.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Alejandro García",
      paidFee: "5000",
    });

    await createSale({
      policyNumber: "123456789",
      assuranceTypeId: assuranceType3.id,
      paidDate: new Date(),
      yearlyFee: "134000",
      contractingClient: "Enrique Bonilla",
      periodicity: "Anual",
      userId: agent2.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Sofia Martínez",
      paidFee: "1000",
    });
    await createSale({
      policyNumber: "523456789",
      assuranceTypeId: assuranceType.id,
      paidDate: new Date(),
      yearlyFee: "135000",
      contractingClient: "Eduardo García",
      periodicity: "Anual",
      userId: agent3.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Clara Chia",
      paidFee: "2000",
    });

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: assuranceType2.id,
      paidDate: new Date(),
      yearlyFee: "325000",
      contractingClient: "Juan Pedro Reyes",
      periodicity: "Anual",
      userId: agent3.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Alejandro García",
      paidFee: "5000",
    });

    await createSale({
      policyNumber: "123456789",
      assuranceTypeId: assuranceType3.id,
      paidDate: new Date("2023-03-11"),
      yearlyFee: "134000",
      contractingClient: "Enrique Bonilla",
      periodicity: "Anual",
      userId: agent2.user.id,
      emissionDate: new Date(),
      insuredCostumer: "Sofia Martínez",
      paidFee: "1000",
    });

    const saleData = [
      {
        policyNumber: "100100100",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100101",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100102",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100202",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100103",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100104",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100105",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100109",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100111",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100112",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100113",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100114",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100115",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100116",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100117",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100118",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100119",
        assuranceTypeId: assuranceType.id,
      },
      {
        policyNumber: "100100120",
        assuranceTypeId: assuranceType.id,
      },
    ];

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          paidDate: new Date("2023-05-23"),
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "1500",
        }).then(({ sale, error, reason }) => {
          if (error) {
            console.log(reason);
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-04-12"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "1300",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-06-16"),
          emissionDate: new Date("2023-06-01"),
          insuredCostumer: "Prueba",
          paidFee: "3070",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-07-21"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "2000",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-08-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-02-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-05-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-01-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-09-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-10-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-11-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      saleData.map((s) =>
        createSale({
          ...s,
          yearlyFee: "134000",
          contractingClient: "Enrique Bonilla",
          periodicity: "Anual",
          userId: agent2.user.id,
          paidDate: new Date("2023-12-11"),
          emissionDate: new Date("2021-01-01"),
          insuredCostumer: "Prueba",
          paidFee: "3200",
        }).then(({ sale, error }) => {
          if (error) {
            throw new Error(error);
          }
          return sale;
        }),
      ),
    );

    await Promise.all(
      Object.values(StatusNames).map((statusName) => {
        return createStatus({
          statusName: statusName as StatusNames,
        });
      }),
    );

    await createProspect({
      name: "Juan",
      firstSurname: "Perez",
      secondSurname: "Juarez",
      userId: regular.id,
    });

    await createProspect({
      name: "Pedro",
      firstSurname: "Perez",
      secondSurname: "Juarez",
      userId: regular.id,
    });

    await createProspect({
      name: "Angelazo",
      firstSurname: "Rico",
      secondSurname: "Hernández",
      userId: regular.id,
    });

    await createProspect({
      name: "Roberto",
      firstSurname: "Gonzales",
      secondSurname: "Gloria",
      userId: regular.id,
    });

    await createProspect({
      name: "Axel",
      firstSurname: "Hernandez",
      secondSurname: "Mave",
      userId: regular.id,
    });

    await createProspect({
      name: "Irving",
      firstSurname: "Rodriguez",
      secondSurname: "Calva",
      userId: regular.id,
    });

    await createProspect({
      name: "Yasodhara",
      firstSurname: "Diaz",
      secondSurname: "Arellano",
      userId: regular.id,
    });
  } catch (e) {
    console.error(e);
  }
}
