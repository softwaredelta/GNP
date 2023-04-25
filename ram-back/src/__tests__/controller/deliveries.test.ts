// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { createGroup } from "../../app/groups";
import { createDelivery } from "../../app/deliveries";
import { setDeliverieToUser } from "../../app/deliveries";

describe("controller:deliveries", () => {
  let accessToken: string;
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);

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
  });

  describe("query endpoint", () => {
    it("rejects unauthenticated request", async () => {
      return request(app).get("/deliveries/my-deliveries").expect(401);
    });

    it("returns group not found error", async () => {
      return request(app)
        .get("/deliveries/my-deliveries/test-group-id")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toMatchObject({ message: "GROUP_NOT_FOUND" });
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
        dateDelivery: new Date(),
        status: "test-status",
        fileUrl: "test-file-url",
      });

      await request(app)
        .get(`/deliveries/my-deliveries/${group1.group.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]).toHaveProperty("userId", "1");
          expect(res.body[0].delivery).toHaveProperty("id", delivery1.delivery.id);
          expect(res.body[0]).toHaveProperty("status", "test-status-1");
          expect(res.body[0]).toHaveProperty("fileUrl", "test-file-url-1");
        });
    });
  });
});
