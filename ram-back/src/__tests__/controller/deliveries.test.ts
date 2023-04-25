// (c) Delta Software 2023, rights reserved.

import request from "supertest";
import { getDataSource } from "../../arch/db-client";
import { app } from "../../controller";
import { authenticateUser, createUser } from "../../app/user";
import { createGroup } from "../../app/groups";
import { createDelivery } from "../../app/deliveries";
import { setDeliverieToUser } from "../../app/deliveries";
import { StatusUserDelivery } from "../../entities/user-delivery";

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
      return request(app)
        .get("/deliveries/my-deliveries/test-group-id")
        .expect(401);
    });

    it("returns no deliveries found", async () => {
      return request(app)
        .get("/deliveries/my-deliveries/test-group-id")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toMatchObject({ message: "No deliveries found" });
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

      const userDelivery1 = await setDeliverieToUser({
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
          expect(res.body).toMatchObject({
            data: {
              userDeliveries: [
                {
                  deliveryId: delivery1.delivery.id,
                  dateDelivery: "2023-04-24",
                  status: userDelivery1.userDelivery.status,
                  fileUrl: userDelivery1.userDelivery.fileUrl,
                  deliveryName: delivery1.delivery.deliveryName,
                  description: delivery1.delivery.description,
                  imageUrl: delivery1.delivery.imageUrl,
                  groupName: group1.group.name,
                },
              ],
            },
          });
        });
    });
  });
});
