// (c) Delta Software 2023, rights reserved.
import { createDelivery, setDeliverieToUser } from "../../app/deliveries";
import { createGroup } from "../../app/groups";
import { createUser } from "../../app/user";
import { getDataSource } from "../../arch/db-client";

describe("app:deliveries", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
  });

  describe("creation function", () => {
    it("creates a new delivery", async () => {
      const group = await createGroup({
        name: "test-group-1",
        image: "test-image-1",
      });

      const { delivery, error } = await createDelivery({
        idGroup: "test",
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-1",
      });

      expect(error).toBeUndefined();
      expect(delivery).toHaveProperty("deliveryName", "test-delivery-1");
      expect(delivery).toHaveProperty("description", "test-description-1");
      expect(delivery).toHaveProperty("imageUrl", "test-image-1");
      expect(delivery).toHaveProperty("groupId", group.group.id);
    });
  });

  describe("set function", () => {
    it("assign a deliverable to a user", async () => {
      const user = await createUser({
        email: "test-email-1",
        password: "test-password-1",
      });

      const group = await createGroup({
        name: "test-group-1",
        image: "test-image-1",
      });

      const delivery = await createDelivery({
        idGroup: group.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-1",
      });

      const { user_delivery, error } = await setDeliverieToUser({
        idUser: user.user.id,
        idDeliverie: delivery.delivery.id,
        dateDelivery: new Date("2021-01-01"),
        status: "test-status-1",
        fileUrl: "test-file-url-1",
      });

      expect(error).toBeUndefined();
      expect(user_delivery).toHaveProperty("userId", user.user.id);
      expect(user_delivery).toHaveProperty("deliveryId", delivery.delivery.id);
      expect(user_delivery).toHaveProperty("dateDelivery", new Date("2021-01-01"));
      expect(user_delivery).toHaveProperty("status", "test-status-1");
      expect(user_delivery).toHaveProperty("imageUrl", "test-file-url-1");
    });
  });

  describe("query function", () => {
    it("get user deliverables for a group", async () => {
      const user = await createUser({
        email: "test-email-1",
        password: "test-password-1",
      });

      const group1 = await createGroup({
        name: "test-group-1",
        image: "test-image-1",
      });

      const group2 = await createGroup({
        name: "test-group-2",
        image: "test-image-2",
      });

      const deliveryNames = Array.from({ length: 3 }, (_, i) => `delivery-${i}`);

      const deliveries = await Promise.all(
        deliveryNames.map((name) =>
          createDelivery({
            idGroup: group1.group.id,
            deliveryName: "test-delivery",
            description: "test-description",
            imageUrl: "test-image",
          }).then(({ delivery }) => delivery),
        ),
      );

      await Promise.all(
        deliveries.map((delivery) =>
          setDeliverieToUser({
            idUser: user.user.id,
            idDeliverie: delivery.id,
            dateDelivery: new Date("2021-01-01"),
            status: "test-status",
            fileUrl: "test-file-url",
          }).then(({ user_delivery }) => user_delivery),
        ),
      );

      const { user_delivery_group, error } = await getUserDeliveryGroup({
        idGroup: group1.group.id,
        idUser: user.user.id,
      });

      expect(error).toBeUndefined();
      expect(user_delivery_group.deliveries).toHaveLength(3);
      expect(
        user_delivery_group.user_delivery.map((user_delivery) => user_delivery.delivery.groupId),
      ).not.toContain(group2.group.id);
    });
  });
});
