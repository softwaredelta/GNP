// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { app } from "../../controller";
import { createUser } from "../../app/user";
import {
  createGroup,
  addUserToGroup,
  addDeliveryToGroup,
} from "../../app/groups";
import { getDataSource } from "../../arch/db-client";
import { createDelivery, setDeliverieToUser } from "../../app/deliveries";
import { userSeeds } from "../../seeds";
import { UserRole } from "../../entities/user.entity";
import { authenticateUser } from "../../app/user";
import { truncate } from "fs";
import { getS3Api } from "../../arch/s3-client";
import { DeliveryEnt } from "../../entities/delivery.entity";

let managerAccessToken: string;
let accessToken: string;
let accessTokenInvalid: string;
let deliveryId: string;
let groupId: string;
beforeEach(async () => {
  const ds = await getDataSource();
  await ds.synchronize(true);

  await userSeeds();

  await createUser({
    id: "1",
    email: "fermin@delta.tec.mx",
    password: "L3LitoB3b3ciT0Itc",
  });
  await createUser({
    id: "2",
    email: "aris@delta.tec.mx",
    password: "L3LitoB3b3ciT0Itc",
  });
  const { group } = await createGroup({
    name: "test-group",
    imageURL: "https://picsum.photos/200",
  });

  await addUserToGroup({
    userId: "1",
    groupId: group.id,
  });
  await addUserToGroup({
    userId: "2",
    groupId: group.id,
  });

  const { delivery } = await createDelivery({
    deliveryName: "test_delivery",
    description: "test-delivery",
    idGroup: group.id,
    imageUrl: "https://picsum.photos/200",
  });
  await addDeliveryToGroup({
    groupID: group.id,
    deliveryID: delivery.id,
  });

  deliveryId = delivery.id;

  await setDeliverieToUser({
    idDeliverie: delivery.id,
    idUser: "1",
    dateDelivery: new Date(),
    status: "Aceptado",
    fileUrl: "https://picsum.photos/400",
  });

  await setDeliverieToUser({
    idDeliverie: delivery.id,
    idUser: "2",
    dateDelivery: new Date(),
    status: "Pendiente",
    fileUrl: "https://picsum.photos/400",
  });

  await createUser({
    email: "test@delta.tec.mx",
    password: "12345678//",
  });

  const authRegular = await authenticateUser({
    email: "test@delta.tec.mx",
    password: "12345678//",
  });

  accessTokenInvalid = authRegular.auth.accessToken;

  const { error: userError } = await createUser({
    email: "test-2@delta.tec.mx",
    password: "12345678//",
    roles: [UserRole.MANAGER],
  });
  if (userError) {
    throw new Error(userError);
  }

  const { auth, error: authError } = await authenticateUser({
    email: "test-2@delta.tec.mx",
    password: "12345678//",
  });
  if (authError) {
    throw new Error(authError);
  }

  accessToken = auth.accessToken;

  const authenticationResponse = await request(app)
    .post("/user/authenticate")
    .send({
      email: "manager@delta.tec.mx",
      password: "password",
    })
    .then((res) => res.body);

  managerAccessToken = authenticationResponse.accessToken;

  groupId = group.id;
});

describe("get all register of a delivery ", () => {
  it("should return all register of a delivery", async () => {
    const response = await request(app)
      .post("/user/authenticate")
      .send({
        email: "manager@delta.tec.mx",
        password: "password",
      })
      .expect(200);

    return request(app)
      .get(`/deliveries/${deliveryId}`)
      .expect(200)
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .then((res) => {
        expect(res.body).toHaveProperty("id", deliveryId);
        expect(res.body).toHaveProperty("description");
        expect(res.body).toHaveProperty("deliveryName");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("imageUrl");
        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("userDeliveries");

        expect(res.body.userDeliveries).toHaveLength(2);
        expect(res.body.userDeliveries[0]).toHaveProperty("dateDelivery");
        expect(res.body.userDeliveries[0]).toHaveProperty("fileUrl");
        expect(res.body.userDeliveries[0]).toHaveProperty("status");
        expect(res.body.userDeliveries[0]).toHaveProperty("user");

        expect(res.body.userDeliveries[0].user).toHaveProperty("id");
        expect(res.body.userDeliveries[0].user).toHaveProperty("email");
        expect(res.body.userDeliveries[0].user).toHaveProperty("imageURL");
      });
  });
});

describe("Update status endpoint", () => {
  it("rejects unauthenticated request", async () => {
    return request(app)
      .post(`/deliveries/update-status/${deliveryId}`)
      .send()
      .expect(401);
  });

  it("rejects bad data", async () => {
    const data = {
      statusChange: 12345,
      userId: "1",
    };

    return request(app)
      .post(`/deliveries/update-status/${deliveryId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(data)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: "BAD_DATA",
        });
      });
  });

  it("rejects requests from regular user", async () => {
    const data = {
      statusChange: truncate,
      userId: "1",
    };

    return request(app)
      .post(`/deliveries/update-status/${deliveryId}`)
      .set("Authorization", `Bearer ${accessTokenInvalid}`)
      .send(data)
      .expect(403);
  });

  it("rejects additional data", async () => {
    const data = {
      statusChange: true,
      userId: "1",
      additionalField: "additional value",
    };

    return request(app)
      .post(`/deliveries/update-status/${deliveryId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(data)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: "BAD_DATA",
        });
      });
  });

  it("updates status of delivery", async () => {
    const data = {
      statusChange: true,
      userId: "1",
    };
    return request(app)
      .post(`/deliveries/update-status/${deliveryId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(data)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
      });
  });

  describe("image file handling", () => {
    it("uploads image file", async () => {
      const fileContents = "file contents";
      const fileName = "file.png";
      const file = {
        buffer: Buffer.from(fileContents),
        originalname: fileName,
        encoding: "utf-8",
        mimetype: "image/png",
      } as Express.Multer.File;

      await request(app)
        .post(`/deliveries/create-delivery/${groupId}`)
        .set("Authorization", `Bearer ${managerAccessToken}`)
        .attach("image", file.buffer, file.originalname)
        .field("deliveryName", "delivery1")
        .field("description", "test delivery")
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  describe("update delivery data endpoint", () => {
    describe("authentication", () => {
      it("rejects unauthenticated request", async () => {
        return request(app)
          .post(`/deliveries/${deliveryId}`)
          .send()
          .expect(401);
      });

      it("rejects non-manager request", async () => {
        return request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${accessTokenInvalid}`)
          .send()
          .expect(403);
      });

      it("accepts manager request", async () => {
        return request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            deliveryName: "new name",
          })
          .expect(200);
      });
    });

    describe("validation", () => {
      it("rejects empty request", async () => {
        return request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({})
          .expect(400);
      });

      it("accepts request that only changes some field", async () => {
        return request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            description: "new description",
          })
          .expect(200);
      });

      it("accepts request that sends fields and image file", async () => {
        const fileContents = "file contents";
        const fileName = "file.png";
        const file = {
          buffer: Buffer.from(fileContents),
          originalname: fileName,
          encoding: "utf-8",
          mimetype: "image/png",
        } as Express.Multer.File;

        return request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .attach("image", file.buffer, file.originalname)
          .field("deliveryName", "new name")
          .field("description", "new description")
          .expect(200);
      });
    });

    describe("functionality", () => {
      it("handles invalid delivery id", async () => {
        return request(app)
          .post(`/deliveries/12345`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            deliveryName: "new name",
          })
          .expect(404);
      });

      it("uploads file data correctly", async () => {
        const fileContents = "file contents";
        const fileName = "file.png";
        const file = {
          buffer: Buffer.from(fileContents),
          originalname: fileName,
          encoding: "utf-8",
          mimetype: "image/png",
        } as Express.Multer.File;

        const response = await request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .attach("image", file.buffer, file.originalname)
          .field("deliveryName", "new name")
          .field("description", "new description")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("imageUrl");
            expect(body.imageUrl).toMatch(/\d+\.png/);
            return body;
          });

        const s3 = await getS3Api();
        const uploadedFile = await s3.getObjectPromise(response.imageUrl);
        expect(uploadedFile.toString()).toBe("file contents");
      });

      it("updates fields correctly", async () => {
        await request(app)
          .post(`/deliveries/${deliveryId}`)
          .set("Authorization", `Bearer ${managerAccessToken}`)
          .send({
            description: "new description",
          })
          .expect(200);

        const ds = await getDataSource();
        const delivery = await ds.manager.findOneOrFail(DeliveryEnt, {
          where: { id: deliveryId },
        });
        expect(delivery.description).toBe("new description");
        expect(delivery.deliveryName).toBe("test_delivery");
      });
    });
  });
});
