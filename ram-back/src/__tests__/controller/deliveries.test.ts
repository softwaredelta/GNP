// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { createGroup } from "../../app/groups";
import { createDelivery, updateDelivery } from "../../app/deliveries";
import { setDeliverieToUser } from "../../app/deliveries";
import { StatusUserDelivery } from "../../entities/user-delivery.entity";
import { DeliveryEnt } from "../../entities/delivery.entity";
import { userSeeds } from "../../seeds";

describe("controller:deliveries", () => {
  let accessToken: string;
  let managerAccessToken: string;
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
    await userSeeds();

    const { error: userError } = await createUser({
      email: "test@delta.tec.mx",
      password: "test-password-1",
      id: "1",
    });

    if (userError) {
      throw new Error(userError);
    }

    const { auth, error: authError } = await authenticateUser({
      email: "test@delta.tec.mx",
      password: "test-password-1",
    });
    if (authError) {
      throw new Error(authError);
    }

    accessToken = auth.accessToken;

    const { auth: managerAuth, error: managerAuthError } =
      await authenticateUser({
        email: "manager@delta.tec.mx",
        password: "password",
      });
    if (managerAuthError) {
      throw new Error(managerAuthError);
    }

    managerAccessToken = managerAuth.accessToken;
  });

  describe("query endpoint", () => {
    it("rejects unauthenticated request", async () => {
      return request(app)
        .get("/deliveries/my-deliveries/test-group-id")
        .expect(401);
    });

    it("returns no deliveries found", async () => {
      return request(app)
        .get("/deliveries/my-deliveries/test-group-id")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toMatchObject([]);
        });
    });

    it("returns the user's deliveries", async () => {
      const group1 = await createGroup({ name: "test-group-1" });
      const group2 = await createGroup({ name: "test-group-2" });
      const delivery1 = await createDelivery({
        idGroup: group1.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-url-1",
      });
      await createDelivery({
        idGroup: group2.group.id,
        deliveryName: "test-delivery-2",
        description: "test-description-2",
        imageUrl: "test-image-url-2",
      });

      await setDeliverieToUser({
        idUser: "1",
        idDeliverie: delivery1.delivery.id,
        dateDelivery: new Date("2023-04-25"),
        status: StatusUserDelivery.withoutSending,
        fileUrl: "test-file-url",
      });

      await request(app)
        .get(`/deliveries/my-deliveries/${group1.group.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });

  describe("delete endpoint", () => {
    it("rejects unauthenticated request", async () => {
      return request(app).delete("/deliveries/test-delivery-id").expect(401);
    });

    it("deletes given delivery", async () => {
      const group1 = await createGroup({ name: "test-group-1" });
      const group2 = await createGroup({ name: "test-group-2" });
      const delivery1 = await createDelivery({
        idGroup: group1.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-url-1",
      });
      await createDelivery({
        idGroup: group2.group.id,
        deliveryName: "test-delivery-2",
        description: "test-description-2",
        imageUrl: "test-image-url-2",
      });

      await setDeliverieToUser({
        idUser: "1",
        idDeliverie: delivery1.delivery.id,
        dateDelivery: new Date("2023-04-25"),
        status: StatusUserDelivery.withoutSending,
        fileUrl: "test-file-url",
      });

      await request(app)
        .delete(`/deliveries/${delivery1.delivery.id}`)
        .set("Authorization", `Bearer ${managerAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("message", "Delivery deleted");
        });

      const ds = await getDataSource();
      const deliveries = await ds.manager.findOne(DeliveryEnt, {
        where: {
          id: delivery1.delivery.id,
        },
      });
      expect(deliveries).toBeNull();
    });
  });

  describe("update delivery without evidence", () => {
    it("update the status to complete", async () => {
      const group1 = await createGroup({ name: "test-group-1" });
      const delivery1 = await createDelivery({
        idGroup: group1.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-url-1",
      });
      await setDeliverieToUser({
        idUser: "1",
        idDeliverie: delivery1.delivery.id,
        dateDelivery: new Date("2023-04-25"),
        status: StatusUserDelivery.withoutSending,
        fileUrl: "test-file-url",
      });
      await updateDelivery({
        deliveryId: delivery1.delivery.id,
        hasDelivery: "false",
      });
      const { auth, error: authError } = await authenticateUser({
        email: "test@delta.tec.mx",
        password: "test-password-1",
      });
      if (authError) {
        throw new Error(authError);
      }
      const deliveryId = delivery1.delivery.id;
      const access = auth.accessToken;
      const response = await request(app)
        .post(`/deliveries/update-status-no-evidence/${deliveryId}`)
        .set("Authorization", `Bearer ${access}`)
        .expect(200)
        .then((res) => {
          const deliveryEnt = res.body.changedDelivery;
          expect(deliveryEnt).toHaveProperty(
            "status",
            StatusUserDelivery.accepted,
          );
        });
      return response;
    });
    it("refuse change status bad data", async () => {});
  });
});
