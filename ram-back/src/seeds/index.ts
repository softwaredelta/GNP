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
    { email: "agente@ram.mx", roles: [UserRole.REGULAR] },
    { email: "claudiafdz@ram.mx", roles: [UserRole.MANAGER] },
    { email: "admin@ram.mx", roles: [UserRole.ADMIN] },
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
      email: "luisferrmz@ram.mx",
      password: "password",
      id: "1",
      roles: [UserRole.REGULAR],
    });

    const user2 = await createUser({
      email: "juancarlosgmz@ram.mx",
      password: "password",
      id: "2",
      roles: [UserRole.REGULAR],
    });

    const user3 = await createUser({
      email: "test3@delta.tec.mx",
      password: "test-password-2",
      id: "test-user-3",
    });

    const user4 = await createUser({
      email: "test4@delta.tec.mx",
      password: "test-password-2",
      id: "test-user-4",
    });

    const { regular } = await userSeeds();

    //GROUPS

    const group1 = await createGroup({
      name: "Novinos (Inducción)",
      imageURL:
        "https://media.licdn.com/dms/image/C5622AQF-LKP9Jny8dQ/feedshare-shrink_2048_1536/0/1656612233694?e=1684972800&v=beta&t=9MbCq9kv7-wpB45fnLCMbqChbeRAtIbf3HefLN65EPI",
    });

    const group2 = await createGroup({
      name: "Capacitación PP200",
      imageURL:
        "https://corredordigital.mx/wp-content/uploads/2021/03/133101280_10164932258730650_5667144890225799800_o.png",
    });

    const group3 = await createGroup({
      name: "Primeros pasos",
      imageURL:
        "https://www.rastreator.mx/wp-content/uploads/formas-de-pago-del-seguro-de-auto-GNP.png",
    });

    //DELIVERIES
    const delivery1 = await createDelivery({
      deliveryName: "Creación de YouCanBookMe",
      description:
        "Los agentes tendrán un calendario en donde podrán ver sus citas y espacios disponibles",
      idGroup: group1.group.id,
      imageUrl:
        "data:image/png;base64,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",
    });

    const delivery2 = await createDelivery({
      deliveryName: "Segumiento de coaching",
      description: "Semáforo para una gestión eficaz del tiempo",
      idGroup: group1.group.id,
      imageUrl:
        "https://efesalud.com/wp-content/uploads/2021/10/EPA-Frank-Rumpenhorst.jpg",
    });

    const delivery3 = await createDelivery({
      deliveryName: "Llenado de PP200",
      description: "El agente tiene 200 prospectos en tabla de prospectos",
      idGroup: group2.group.id,
      imageUrl:
        "https://www.mailclick.com.mx/wp-content/uploads/seguimiento-de-prospecto-twt.png",
    });

    const delivery4 = await createDelivery({
      deliveryName: "Primera cita con prospecto",
      description: "Seguimiento de primera cita con prospecto",
      idGroup: group3.group.id,
      imageUrl:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBQSEhcSExQXGBcXFxcaFxkaEhgXFxoYGhcYGBgaGRoaICwjGiApIBoYJDYkKS0vNTU1GiI4PjgwPS4yMy8BCwsLDw4PHhISHTIpIyk0MjIyMjIyMjIyMjQyMjIyMjIyNDQyMjIyMjIvMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAKkBKgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQBAgUGB//EAEQQAAIBAgMECAIHBgQFBQAAAAECAAMREiExBEFRYQUTIjJxgZGhQnIUM1JigpKxBiOiwcLRU2NzkySys+HwFTRDg9L/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAiEQEBAAICAwACAwEAAAAAAAAAAQIRITEDEkETMlFhcSL/2gAMAwEAAhEDEQA/APs0REBERAREQEREBETEDMxE59SpjawuRnZQbAgGxZ2GguCAN9t+6W6WRPtDHJQTdju1Ci2I8uHmJq2yKM1srAizWJOueLO7X0zMgTYyozSm2pNiQ2ZvkSP7Tc4lXHTLEWvha7eNr5g8ryf6v+LGz1CwNxZgSDwuOHIgg+cnlfZAMN7kkk3JFje9jluta3lLEs6SsyN2sCToBeSSrtndF74cQxWNuzvz4aX5XikR9Y74bAqrZ4gQWta4uCLC/nJMNQaMHH3uyfVRb2m7sqLnkBYD9AAN/hNQ7nRAB957H0AP6wMfSCO8jAcRZh7Z+0nRgRcG4Oh3SOlUJJVlsR5gjkf5SCgStRl+EliBbSwQkjkSxk2aXoiJpCU9s26nRANRwt9Ac2Y8FUZseQEzt+1rRpPVbMKL2GpOgUcybDznlKWyVaz43NiwvUqi1wN1KkD3QONueZM555+reOPs6r/tOmLAtGqxte5CILXtftMCPMCSJ+0S37VGqo4gI49EYt6Cczb9iSgoqU1yuBVJZmbDmA12J0Y58ieEjnL8uTr+PF6nY9sp1lxU3DDQ21B4MNVPIy1PDvUak3Xpk6C7W+NBmyNxyvbgbGe1puGAI0IBHgZ1wz9o5Z4+qSIidGCIiAiIgIiICIiAiIgIiICIiAiIgVtpJuqA2xXud4Ua29QPOVdiHVpjNyTgHAEEgLYcgR7yXbwQC6i9kcHPOxAN/IrJaqDBYnCAFzysLEEa8wJj618ZWnZye1+ckG98sOgtl6yBnxkDiz2ILLZUOEnI5m+njMjaCBdRiUauTYtnnhAGfsOEiVij2wscntYXBxMGXPQbxnwi0kWdiyS28FgTxIY3Pnr5yzIdnQqoB1JJPiSSf1k01OkrMr7Q5yUZFja/AWJJ9B7iWJV2g4WRjoCQTwuMieWVvOKRoli4FwcIYXLHFfK9haxtdRfnN3YsAUYgaZKpzva5vuHKNiN0vxZz6u01pBkBxlQoLG9zfNibnhkbWzgSVzkFxYSd4GdgLnw8ZV2ZSGRyScYORJOEEYhYnkLGSVqgbAwOWIqciLYlIFwdM8PrM0QSyA6onazv2jYD2Deomfq/F2IlXpBmFGoV7wR8PjhNvebZeX6Z6Z6ymRh7BdeqC5u5puGDG+QQkDnYjebS30XRFJGUu5KfWFyQgYgVGKXyC9r/AMtOPQQNtFBAOzgpFMssKCpUax8Upe07nTf/ALWt/pVB6qRPL5LuvThNRrtuyhnAL1Qal1GFr01AQk4kPZsbHvA3JnOr0fo5WmSxQ5I50vc2QniBaxOvjO9RrK4xIwYXIuCCLg2OY5yPbKiJTZnAK5XBFwbkAC2+5IE5tPN7TUZ1qImEAAq9R3wopI0vY3IuP7z1nQe3rXpZAAocBAcOuQBBVh3gQQb/ANp5/o/ZEaowtdKRCqDneqwxu54mzLY82lvofa6VKvWHd6ysirYdkuKYvpoS1xzPjPRhPVxzvs9TEROzkxMxEBERAREQETEQMxMRAzExEDMTEQMxMRA1dQQQdCLGVUqYRhcG4FsWElSBobjTwMuSt9JB7oZ/lGX5jYH1kqxFSpOy3aoGGRBCqdN+nGSUlCthzLMLlidbG1uVrjIcZnZ8iy8GJHytn+uIeUVmUMl2APay4rhN/AZA35QLUSr9Jt31ZedsQ9VvbztJkYMLggg6EG4jZpJExEqKdKqKZKsbDExVjkpDEm19xBJFpFtBYtdKePQqTU7N+IGgtLz1FGpAvxIH6yOghUsLZYrr5gX97+szZ8WVVagci9mxst0+EZAfiyXflL1OkqCygCRbT8OYBxrbnx9rzP0pL2xrfhiETULurETAMTSPNbV0YlCrRqIWCmoy4CQUTFSqd3K47QAtewvYASbpKq1NGqhkCIO2GRmviIAsVOXodd06u3bKK1MoSRexDDVWUhlYcwQD5TmJtFSmy0q1Idu6B1KtTeysxGEnEt1UmxBG65nDPDV38dsMuNfUGwFq4um0UlsO5Tp3ZfmxkEeGESDaaprbMoJXrCylVxBeselUxWQE/FgNvGat0IrAqV2dVJzwbIFqW+6zOwTU5gb8rS/sez0qNZFp0kUvjGIKARhW+Ztc+sx/zbJGuZLa4NXaqiFxRuGqkEh6TqabYVQsSbAZKMjvGV7yOvT6ugwBJKKWvvLL28XjiF51ek67PtNRScqeBQN2ahyfPGB5Ssyggg6HI+Emd/6XCcPZiZnnehulMOGhWPBab7m3Kj8H3X0bxynop6ccplNx58sbLqsxMRNIzExEDMTEQMxEQEREBERAREQERKu1G9kGrXueCjvH9B5wNqlEue13R8P2jz5cpHWviVL4VO8akj4Qfhy/7S0BYZSBSKiWNsx2gCDhbxG8H9JLFivWVncqMsJyfeAVU2HG515ezZKYZmYrawwm+ZLHvXJ1FsNpnZalmYNrhF/FcmPmCh85imSQFGRa7sd6hiSB4nQeBmf7X+kuysQxQZqujcPuniRx9c5s9GxxJkd4+FvmHHnr46SemgUAAWA0E3mtIrfSVwYiDrbD8WLTDbjMdW7ZsxUfZU29W19Lec3pMHAa2hOE8tLjxm9UEqQpsbGxtex3Qjn7RSWzhVAsjYja5JKmy3OfM+XGb7VWAsyG7iwyzFiQCG4C/nfzk2zqChW1jmGBNzc63O+9735yMG9KmN7GnfxFmb2UzLW2itle96hODP4WOoA3C3a5gSamMLYDmpAw34gWYfz9YVQ1UtYdgYb8WOZ9Bb8xjaji7AF2OYzth4MSNOXH1gbHZV1W6HiuXqND5iKdYghXtc6MNG5cjyk1MEAAm5sLm1rnjNa9MOpU+R4HcR4Ga1/CbSzldOC3Uv8AYrL/ABo9P9XE12npcKerResqgdoKbIht8b27PhYtynOpdINWbqXZWLOVUimOqV0Rqq6tiYKUBJv3sst3PPKdNY43t1ZWqG20bOeL1F8zSdv6ZS/9XIq/RnpMattKbU2U5XyZ2WxtnhIvaNprOrq9UYCqvUSmpxuSq4WZyOyLB7BQTcm98rThJZdu11Zpnp6h1dZagIIqkKy/EGVCQ44jCoB/DxlSb1tjWqRVWpUDEXBx4ls1iey9wL2XS2gleotSnm6h1+1TBuPGmbn8pPhJllMruNY42TTeogdSrC4IsRPS9CVmfZqTubsUW54m1r+evnPLs+KmTTIJKnAb5XtlmOc9H0DtCNRVUBXqgtMq1rjCotpkQRYg/wA7idfD3XPy9OtERPQ4EREBERAq9edcBK7mUhsuNsj6Xm6bQjGwYX4HI+hzmlDssyfiXwY5jyN/USZ6YYWIBHAi4km1ukkSr9FA7pZfBrj0a49pn94v2X9UP8wfaNmliJXO0gd5WXxW49VuB5ycG+YlRtERAxKJqgFqjXtcIumgNjmch2r5ngJZ2iphVm4A25ncPWVNqpBKa3J7NhbVWJ+0Lga7yRM1YkO1MRdUbUb0ItcX7rHdeQqnauoIvcqSpFt5RhvGpB9OcVOgDmdn80qKPYMLes6iLYAZ5cSSfU6yTd7W6jl7b2gXAII7NQbwDl5ixOfgd06GyoQLnvMbnlwHkLDyleqQ2JxYYcg5zDWOakbxf30ljZ6+LIgqwGanUf3HOJ2XpPOf1rMGXPtOVVsr4c8R8rN7ToSlsVP4jnhBUcL3u5Hi2X4ZakW0UAADdkJhagJIHwmx/KG/mJvINn71T5x/00lRpW7Lh9xsr/0t5E28+UrhgpAOiNUPlbEPZ7S/UQMCDoQQfAzksrF0BPFW/Ab3PzKBM5cNTleQlEFxd2N7cXbO3gOPASShSwjM3Y5seJ/sNAJpQGM9Yd+SjgvHxOvpLc1EqMMDfPTI8jr/AGnI6YquzCkjYEtd2U2c8EX7N9S2uluItdI1uoR6wzAQ9niwyQDxvb0nKoqwUB2LNbtMd7bz67py8udxmo6eLCW7UtpTB1dJP3dNywJUdrFa4W/w4u12tbjcTeTps4FWhTQlAC+EqBdf3NQXGIEXz3gxt1PrKTYCCbYkIz7a9pD+YCb7HVD1tncaMHYedMkTz4ftHfP9alTo1DVq0hcBadIhr3cVWqVHNS51a6oc9dNMpW2Z3qO9R2ViD1alVKqVpsQWCkm13xb9wluttJRdsqr3usWmnzdVSVP43MqlkoUwM7KFVQM2Y6KBxJM6eW8ac/FOdotmPVP1J7puaR3W1NPxXd93wMvSps+ykt1lWxf4RqtMcF58W1PIZS3OFd3M26j1bdauSsR1o3XOQqDgb2B5Z7p0f2ZUmrWcd21NL8XXGzegdR68IqUwylWFwwII4gixnS6BQrs6KVClAUyAAOFiuIAZDFbF5zt4ecnHzcR04iJ63mIiICIiBV2rs4X+yc/lOTemR/DLM1dQRY6GQ7IThwnVDhPMDQ+YtJ9PizERKMSgKhV7Emwa2Z3ObqfJgV85flPbqYIDbu63ytbPyOE+RmasXZVFVzmqqynMWYhrHkRb3E32Z8SAnXRvmGR9xMbHkpX7LMPLEbe1pURVawYAMGWzKTdTbI3tiFxqBvlhaisMiGHIgiSSF9nVjcqL8bWPqM45XhV6tGZgqpkvewjvEnfyt7zf6McOTMhIzF8QGXPTyImX2IH4ibaBgHH8Qv7zCUmS9kQg64ewT+E3HvJpd/wUaZawYAKmgGhI0Oe4bufgJPWohrbiNCNQeX9pBs11JFiqjc1uz8pFwRyvlLsTpKpVKzKpU2x5AWvY4iQp5aHLl4S1SphVCjQC0r7VSJxED4MvmBxL7y3LOytHYKCSbAC5PKR7P3qnzj/ppNKvbYJ8K2ZuZ1Vf5nwHGbUe+4+U+ot/TJ9PixOXtKE18G51uf4Q38KW/FOrK1v3vgn6t/2izZLpYmYiaRwun3xNSo8WNRvlp2wj87IfwmUOknK0nKmxK2B4FjhB95NWfHtNV9yYKS/hGNiPxPb8Ei2+kXpuq94r2fmGa+4E8Xly3m9fjmsWK1QUVREQkkhKaiw0UmxJyAAUny3yv0YcL0FP/wAdapTPJTTq4PY05YZVr0wQSMQDKR3lbUHxB3eInJ2ramQCuRa1SmKoHw1aTjtDk6XHmkmPa5cx1MeNaC/4j1Npb5Sx6sH/AHE/JIaNZalUOWFhiFEH4iMnqDjwHK53yns7moEpodaVGncHu0qdNXqMOBLVMHj4S5WUVCKKABKZXG1u6VsVSn97S53Dmcmd3TCajoTWnVV74T3WKnLQjUfofMTeUx2K/Kql/wAdOw9SpH+3MNrktdF7Uetai1rYA6HebNaoD4EofxSrIxUwVqL/AH8B+WopUD8/V+k34rrOOfkm8Xp4iJ7nkIiICIiAkDBVJc3GQB3jI5HLxk8QI6dRWF1II4g3kkgqbMrZ2seIJVvUZzTBUXusGHBhY/mX+xkFqaVEDAg6EEHwMg+k27ysvO2JfUaedpMjhhcEEcQbiNrpQoVsDFWJz1Nie0oAJNtLrgbzMs7OwxPYgg4WBBuMxh/pkG2Aqwcf+FQT7rjH5ZKqhagZQAHU3sNSCCD6EyRauRETTJERAqbet1HzAfmun9UxswYhXDZMoLKeNtV4eGk3236tjwF/Ne0P0jYj2bcGYeQY29rTP1fjjptVY3enVV1LNZalPTMjCGTCRYi2YYydel3X6ygw+9TYVF8wcL+QUyrs64HrU/s1XI8KgFX9XI8pYk5aWNh6RoNZFqLjOZVro5J1OB7N7S2Mqp5oP4Sf/wBTk1aSuMLqrDgyhh6GQpseH6p6lPkj3QeFN8SD0l2j0kgH1p+Rf+ZpyV2vaU/w6o5hqT+oxKfQTdOl1D4qlOpT7IGaY1yJN8VMtYZ7wI3E07ciq1AqszZBQSfAC5key7ZTqi9N0cb8LhreNtJS/aJv+HZP8QpT8qjBW/hLHylt1Nkm7pyejwerVm7z3qN81Ql2HqxEszE02mqKaNUOiKzHyBM+f29qDZVwVHp/CbVF5B2ZXH50Y/jkO20lDkP9XWUo/J1BKtyutxfiqyz9GNJ6CHvDZzj5vjQsfzMx85D02gbZqoP2GI5EC4PkReaynrlpMbubcroOk60kVTapVFw1vq6QJOLxJY25sNwnfoUVpqEUWA0/mSd5JzJlXo5AcdQaMcKcqVO6rbkTib8Ql2S1YzOb0zUK9Uyju1C5+RKdRqn8N50ZpTph9opowuClW45YQp9mjCbykTK6m0kr9IKTScr3lGNfmQh191Ex0eT1aqxuyXpseLU2NMnzK385Yjqnbv0agZVZdGAI8CLiSzl/s619mQfYxU/9t2p/0zpz3y7m3js1dMxESoREQEREBERASu+zKTe1jxUlT6jWWIgU2ovpiDC4NmFjkbjtL/aQjZ2VlN7qrZDM2U3HgLX56TozVhcWvbmJnS7bxKtqi6EOOfZb1GR9BA2pR3wUP3hYfmHZ95dmlqJgGZlRo63BHEWlLo2oLFSRc4Ta+fcUH3Bl+c7ZqalmVgCO1kRfuux/R1mb3Gp1VPbFw7UeFSkpHjTchj6VE9JtHS1EU2ouL2FRkNyTZaiHS+gxrTyiRSIiEIiIENfY6dQ4nRSw0a1mHgwzHkZS2yqKeCmS7BalNwXdntjJpZMxJNiwyOXanTnH6fTusNerqgc2ULWX3omZynDWN5XNoR2ACPgzzOEMbfdvkDe2ZB8JQ2xTTHfquLXONVekfu1Aq3UHiBle86VOoHUOpBVhcEaEGbTyS6epttxx1UqrYoaTAMrBlJLKciNdNZU6SW9CqP8AKqf8hmKmxC5amTTY5kr3SfvIey3jrzkNeo2CpTqmmhKMA+MBTcEZq2a66Z+MuWXtltMZ6zS5s6gIoAsAqgDgLC0klEbb3FpgVMSsQwcBOwVVu1nfNhpxm4aufhpL/wDY7+2Ff1mdKtTfY6bHaKbAHCtOpc7gSadr+Nj6Sl1FY96sB8lID3ct+kyNhX4nqvxvVYA+KqQp9JrC+t2mU3NIG28LXrKELDrC1lZGdRhUMTTDYrFgzZZ2YZS9Rqq6hkIIOhEifYaZQJgCgZrhAUqeKkd085vQohBuxGxdrAYmAAxEDK5tJld3ZJqaX/2ebs1V+zWb+JUqf1zsTi9Ad+uPvqfWkg/pE7U9uH6x5M/2rMRE2yREQEREBERAREQEREBMGZiBVOyqM1uh+6bD8uh9IvUXg45dlvfI+0tRJpdqw2pb2N1PBhb0Oh8jK7Ngq4jkpJz3dpV/nT95eZQRYi4kI2VRe1wDuDEAeABy8pLKSxz+m6gfZ3KhroBUBwMBekwqAC4zvhmoN8xpOl9ETPsg3BFzmbEWOZz0nF2BGSkiODiRQrX1JXs387X85Lv6vHxPERAREQEpdKKMCMdFq07+DN1TezmXZW6UQtQqga4Gt8wF19wJKs7a9GdEhtnpvTc03wBWsA1NnTsMWQ5XupuVKk7zKb7S+YL00CuyGphY43UkMtGle7EWIOuYNgZf6H6Up00dXJUda5BwMVAqBa1yVBCj94czbSa0ej2qCpVpV6TO7dioq4iqlrlQbkL2cshrmbmYzwmWtdt452dqlPs9qoKmAjCz16qUlwnvFaajW32gDzEtbR0bR6moKdOmuKm1mVFvmpsQwGe43k2y9BMuJmanjIGGoKbPUBvmS9Rmv4WAktboVyp/4iqxsciURSeH7tAQPWY/Hf4a/Jih6Sq4/otT7eIeT0jU/oExKA6Nq0lcVKVaoAv7pae11GRcKWAILo2Z4KbC02oUNmaym+O2aPUqo5Ns7JUYHWZzxtu18eUk0uyJ9oRe86jxcD9TOZV2amr3NJEJt+7r01wE6WSst1BPA4jnoJe6HpolUIlIAEkVKbouOl2WYOr/ABoSLanXIixWZxw3dbbyy1Nsf+pUNOtpk8BUUn0BljZ6hqMFSnUIOrmmyIOeJ7X/AA3npAoGgmZ3ngn2uN81+RzdjoLs4YFmLOxdmwm17BQLgWACqo8r75ep1VbusD4EH9JJIqmzq2qgnjYX9Z2k1xHK3faaJV+jW7ruv4sQ9GvM4ag3q3iCp9Rf9I2LESv17DVG8VIYf39pt9JX73+2/wDaNw0niIlQiIgIiICIiAiIgIiICIiBicra+i2Zi9KqyMTcqw6ymT4Ehl/CwHKdWJLNrK87UarT+tpG326V6i+agYx+UjnN6FdKgxIysOIINjwPA8p35Q2roulVOJks/wBtSUf8y2JHI5Seq7U4mKnR9en3HWqv2alkfydRhPgVHjK521VIWorUmOQFQYQTwVxdG8AZlVmZtMRKjzGzbS9IhEbtGmqKhp4g70XqUmzxLhsETMnfvl+v2R1lfZwhA7VWlUzXxYYHHleVdrRutZUpo5NSqgVwCpFRKda9jkTdalhceMioUKZOGmK5q020/dlEY+OKkgHLtTDo7Gx7cxyo7UHyv1dVMTW4/DU8zedFOlqi/WUG+amwqDzU4W8gDOIzvcLWqGpUXPqqIwnj+8e4IHMlFPAzem1faTZB2f8ALcrT/HXtdvCmMuM1LWLHrKVUMLqb+xHIg5g8jMbRs6VFwuisp3MoYehnJ2Wguw0GJ7TO+LCi2xVGCqFQEk54RmTxJI3QOlWr2qtRh/l0nami8i62dzxJIHITW2dLlXoNLEU3qUwdUuKlMjhgqBgByW0z0V0QtDtEl2AZVOaqqMQxRVuQBdR+mQAEojZCudOpVRt3716i+aVCQR6HmJ29hr9ZTWpcHEoJIBAvvtfO176ySTfS23Xa1ERNskREBERAREQEREBERAREQEREBERAREQEREBERAREQEjqIGBUgEHUEXB8RJIgcep0Kozos1E8F7VP/bbID5cPjK1RK9P6ynjX7dLM+Jpt2h4KWnoImfWLt4ja0WrULL21DUMagkOpDuj4lyZexUubgZKZJRSpW7FIDqxkBSOCkBp2q1rn5aQy3mdnpzSp/ot+jzp7J9Wnyr+gmZOW98OVsf7PooAqWfO+ALhog8cHxnm5bynbUAZCZibk0xbtyul9ldmp1EAbq8d0LYb4gBiU6YhYjPczZiVQm0tpQC/6lZAP4A5noIjRtw06JqVPrqll3pSBQHkzk4iPlwzr0qaooVQAqgAACwAGQAHCSTMQvJERKhERAREQERED/9k=",
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
      status: StatusUserDelivery.accepted,
    });

    await setDeliverieToUser({
      idDeliverie: delivery1.delivery.id,
      idUser: user2.user.id,
      dateDelivery: new Date(),
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery1.delivery.id,
      idUser: user3.user.id,
      dateDelivery: new Date(),
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery1.delivery.id,
      idUser: user4.user.id,
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
      idDeliverie: delivery1.delivery.id,
      idUser: user2.user.id,
      dateDelivery: new Date(),
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery2.delivery.id,
      idUser: user2.user.id,
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
      idUser: user2.user.id,
      dateDelivery: new Date(),
      status: StatusUserDelivery.sending,
      fileUrl: "https://picsum.photos/400",
    });

    await setDeliverieToUser({
      idDeliverie: delivery4.delivery.id,
      idUser: user.user.id,
      dateDelivery: new Date(),
      status: StatusUserDelivery.sending,
      fileUrl: "https://picsum.photos/400",
    });
  } catch (e) {
    console.error(e);
  }

  // ASSURANCE TYPES

  await createAssuranceType({
    name: "Gastos médicos mayores",
    description:
      "El seguro de gastos médicos mayores abarca los gastos de hospitalización, cirugía, medicamentos, estudios clínicos, honorarios médicos, entre otros.",
    id: "1",
  });

  await createAssuranceType({
    name: "Seguro de mascota",
    description: "El seguro de mascotas abarca los gastos de veterinario",
    id: "2",
  });

  await createAssuranceType({
    name: "PYMES",
    description: "Seguros para Pequeñas y Medianas Empresas",
    id: "3",
  });

  await createAssuranceType({
    name: "Patrimonial",
    description: "Seguros de patrimonio",
    id: "4",
  });

  // SALES

  await createSale({
    policyNumber: "423456789",
    assuranceTypeId: "1",
    sellDate: new Date("2021-01-01"),
    amountInCents: "100000",
    clientName: "Mónica Ayala",
    periodicity: "Anual",
    id: "1",
    userId: "1",
  });

  await createSale({
    policyNumber: "423456789",
    assuranceTypeId: "2",
    sellDate: new Date("2021-02-01"),
    amountInCents: "5000",
    clientName: "Juan Pedro Reyes",
    periodicity: "Anual",
    id: "2",
    userId: "1"
  });

  await createSale({
    policyNumber: "423456789",
    assuranceTypeId: "2",
    sellDate: new Date("2021-01-01"),
    amountInCents: "34000",
    clientName: "Enrique Bonilla",
    periodicity: "Anual",
    id: "3",
    userId: "2"
  });

  await createSale({
    policyNumber: "223456789",
    assuranceTypeId: "3",
    sellDate: new Date("2021-01-01"),
    amountInCents: "20000",
    clientName: "Karen López",
    periodicity: "Mensual",
    id: "4",
    userId: "2",
    status: "Revisada",
  });

  await createSale({
    policyNumber: "123456789",
    assuranceTypeId: "4",
    sellDate: new Date("2021-01-01"),
    amountInCents: "70000",
    clientName: "Jordana Betancourt",
    periodicity: "Mensual",
    id: "5",
    userId: "1",
  });

  await createSale({
    policyNumber: "123456789",
    assuranceTypeId: "2",
    sellDate: new Date("2021-01-01"),
    amountInCents: "56000",
    clientName: "Olivia Olivares",
    periodicity: "Mensual",
    id: "6",
    userId: "1",
  });

  await createSale({
    policyNumber: "323456789",
    assuranceTypeId: "1",
    sellDate: new Date("2021-01-01"),
    amountInCents: "400000",
    clientName: "Renato Fernández",
    periodicity: "Trimestral",
    id: "7",
    userId: "2",
  });

  await createSale({
    policyNumber: "423456789",
    assuranceTypeId: "2",
    sellDate: new Date("2021-01-01"),
    amountInCents: "9000",
    clientName: "Rodrigo Muñoz",
    periodicity: "Anual",
    id: "8",
    userId: "2"
  });

  await createSale({
    policyNumber: "823456789",
    assuranceTypeId: "4",
    sellDate: new Date("2021-01-01"),
    amountInCents: "28000",
    clientName: "Ian García",
    periodicity: "Anual",
    id: "9",
    userId: "2",
  });
}
