// (c) Delta Software 2023, rights reserved.

import { createAssuranceType } from "../app/assuranceType";
import { createDelivery } from "../app/deliveries";
import { addUserToGroup, createGroup } from "../app/groups";
import { createProspect } from "../app/prospect";
import { createSale } from "../app/sale";
import { createStatus } from "../app/status";
import { UserError } from "../app/user";
import { createUser } from "../app/user";
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
    { email: "regular@delta.tec.mx", roles: [UserRole.REGULAR] },
    { email: "manager@delta.tec.mx", roles: [UserRole.MANAGER] },
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
      email: "luisarriola@ram.mx",
      name: "Luis",
      lastName: "Arriola",
      password: "password",
      id: "1",
      roles: [UserRole.MANAGER],
    });

    const user2 = await createUser({
      email: "valeriaherrera@ram.mx",
      name: "Valeria",
      lastName: "Herrera",
      password: "password",
      id: "2",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "lauradiaz@ram.mx",
      name: "Laura",
      lastName: "Díaz",
      password: "password",
      id: "3",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "danielagomez@ram.mx",
      name: "Daniela",
      lastName: "Gómez",
      password: "password",
      id: "4",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "armandocamargo@ram.mx",
      name: "Armando",
      lastName: "Camargo",
      password: "password",
      id: "5",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "karladíaz@ram.mx",
      name: "Karla",
      lastName: "Díaz",
      password: "password",
      id: "6",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "marthaarriola@ram.mx",
      name: "Martha",
      lastName: "Arriola",
      password: "password",
      id: "7",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "oliviahernandez@ram.mx",
      name: "Olivia",
      lastName: "Hernández",
      password: "password",
      id: "8",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "carlosarmijo@ram.mx",
      name: "Carlos",
      lastName: "Armijo",
      password: "password",
      id: "9",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "miriamcontreras@ram.mx",
      name: "Miriam",
      lastName: "Contreras",
      password: "password",
      id: "10",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "itzeldiaz@ram.mx",
      name: "Itzel",
      lastName: "Díaz",
      password: "password",
      id: "11",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "carmenbarbosa@ram.mx",
      name: "Carmen",
      lastName: "Barbosa",
      password: "password",
      id: "12",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "yarelygarcia@ram.mx",
      name: "Yarely",
      lastName: "García",
      password: "password",
      id: "13",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "gustavoperez@ram.mx",
      name: "Gustavo",
      lastName: "Pérez",
      password: "password",
      id: "14",
      roles: [UserRole.MANAGER],
    });

    await createUser({
      email: "claudiafernandez@ram.mx",
      name: "Claudia",
      lastName: "Fernández",
      password: "password",
      id: "15",
      roles: [UserRole.MANAGER],
    });

    const { regular } = await userSeeds();

    //GROUPS

    const group1 = await createGroup({
      name: "Noveles (Inducción)",
      imageURL:
        "https://media.licdn.com/dms/image/C5622AQF-LKP9Jny8dQ/feedshare-shrink_2048_1536/0/1656612233694?e=1684972800&v=beta&t=9MbCq9kv7-wpB45fnLCMbqChbeRAtIbf3HefLN65EPI",
    });

    const groupNovelWeek1 = await createGroup({
      name: "Noveles (Semana 1)",
      imageURL:
        "https://media.istockphoto.com/id/1420107347/photo/start-written-on-starting-line-on-of-running-track-of-sports-field.jpg?b=1&s=170667a&w=0&k=20&c=BWUlJ_xLHqczgTWek2hzHPD0IwFi3AvjB2DXPtoKw8I=",
    });

    const groupNovelWeek2 = await createGroup({
      name: "Noveles (Semana 2)",
      imageURL:
        "https://cdn.pixabay.com/photo/2017/11/27/07/02/time-2980690__340.jpg",
    });

    const groupNovelWeek3 = await createGroup({
      name: "Noveles (Semana 3)",
      imageURL:
        "https://media.istockphoto.com/id/1255703247/es/foto/una-mujer-haciendo-y-mostrando-el-signo-de-mano-n%C3%BAmero-tres.jpg?s=612x612&w=0&k=20&c=8c0VI8divs47gO0Ui8XMhSAdtJMgPeUZFLEV4VvUkFg=",
    });

    const groupNovelWeek4 = await createGroup({
      name: "Noveles (Semana 4)",
      imageURL:
        "https://corredordigital.mx/wp-content/uploads/2021/03/133101280_10164932258730650_5667144890225799800_o.png",
    });

    const groupNovelWeek5 = await createGroup({
      name: "Noveles (Semana 5)",
      imageURL:
        "https://media.istockphoto.com/id/1390194789/photo/hands-of-an-asian-woman-studying-in-a-coworking-space.jpg?b=1&s=170667a&w=0&k=20&c=IFGwTyl9w2cxmpzytoRC23DOzQVLLixtf_D0nXCwrgs=",
    });

    //DELIVERIES
    await createDelivery({
      deliveryName: "Creación de YouCanBookMe",
      description:
        "Los agentes tendrán un calendario en donde podrán ver sus citas y espacios disponibles",
      idGroup: group1.group.id,
      imageUrl:
        "https://osbsoftware.com.br/upload/fabricante/you%20canbook%20me.png",
    });

    await createDelivery({
      deliveryName: "Segumiento de coaching",
      description: "Semáforo para una gestión eficaz del tiempo",
      idGroup: group1.group.id,
      imageUrl:
        "https://efesalud.com/wp-content/uploads/2021/10/EPA-Frank-Rumpenhorst.jpg",
    });

    await createDelivery({
      deliveryName: "Llenado de PP200",
      description: "El agente tiene 200 prospectos en tabla de prospectos",
      idGroup: groupNovelWeek4.group.id,
      imageUrl:
        "https://www.mailclick.com.mx/wp-content/uploads/seguimiento-de-prospecto-twt.png",
    });

    await createDelivery({
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

    // ASSURANCE TYPES

    await createAssuranceType({
      name: "GMM",
      description:
        "El seguro de gastos médicos mayores abarca los gastos de hospitalización, cirugía, medicamentos, estudios clínicos, honorarios médicos, entre otros.",
      id: "1",
    });

    await createAssuranceType({
      name: "VIDA",
      description: "Seguro de vida",
      id: "2",
    });

    await createAssuranceType({
      name: "PYMES",
      description: "Seguros para Pequeñas y Medianas Empresas",
      id: "3",
    });

    await createAssuranceType({
      name: "PATRIMONIAL",
      description: "Seguros de patrimonio",
      id: "4",
    });

    // SALES

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: "1",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "135000",
      contractingClient: "Eduardo García",
      periodicity: "Anual",
      id: "1",
      userId: "1",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Clara Sánchez",
      paidFee: "2000",
    });

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: "2",
      paidDate: new Date("2021-02-01"),
      yearlyFee: "325000",
      contractingClient: "Juan Pedro Reyes",
      periodicity: "Anual",
      id: "2",
      userId: "1",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Alejandro García",
      paidFee: "5000",
    });

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: "2",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "134000",
      contractingClient: "Enrique Bonilla",
      periodicity: "Anual",
      id: "3",
      userId: "2",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Sofia Martínez",
      paidFee: "1000",
    });

    await createSale({
      policyNumber: "223456789",
      assuranceTypeId: "3",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "320000",
      contractingClient: "Karen Mejía",
      periodicity: "Mensual",
      id: "4",
      userId: "2",
      status: "Revisada",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Gabriel Torres",
      paidFee: "40000",
    });

    await createSale({
      policyNumber: "123456789",
      assuranceTypeId: "4",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "470000",
      contractingClient: "Isabella Morales",
      periodicity: "Mensual",
      id: "5",
      userId: "1",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Alberto Ruíz",
      paidFee: "7300",
    });

    await createSale({
      policyNumber: "123456789",
      assuranceTypeId: "2",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "56000",
      contractingClient: "Olivia Herrera",
      periodicity: "Mensual",
      id: "6",
      userId: "1",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Camila Herrera",
      paidFee: "700",
    });

    await createSale({
      policyNumber: "323456789",
      assuranceTypeId: "1",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "470000",
      contractingClient: "Renato Fernández",
      periodicity: "Trimestral",
      id: "7",
      userId: "2",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Yamilé Huerta",
      paidFee: "4500",
    });

    await createSale({
      policyNumber: "423456789",
      assuranceTypeId: "2",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "95000",
      contractingClient: "Roberto López",
      periodicity: "Anual",
      id: "8",
      userId: "2",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Brenda Ramírez",
      paidFee: "16000",
    });

    await createSale({
      policyNumber: "823456789",
      assuranceTypeId: "4",
      paidDate: new Date("2021-01-01"),
      yearlyFee: "28000",
      contractingClient: "Miguel Barrera",
      periodicity: "Anual",
      id: "9",
      userId: "2",
      emissionDate: new Date("2021-01-01"),
      insuredCostumer: "Eduardo López",
      paidFee: "1000",
    });

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
