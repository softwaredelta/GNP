// (c) Delta Software 2023, rights reserved.
import {
  createDelivery,
  deleteDelivery,
  getUserDeliveriesbyGroup,
  setDeliverieToUser,
  updateDelivery,
} from "../../app/deliveries";
import { createGroup } from "../../app/groups";
import { createUser } from "../../app/user";
import { getDataSource } from "../../arch/db-client";
import { DeliveryEnt } from "../../entities/delivery.entity";
import {
  StatusUserDelivery,
  UserDeliveryEnt,
} from "../../entities/user-delivery.entity";

describe("app:deliveries", () => {
  beforeEach(async () => {
    const ds = await getDataSource();
    await ds.synchronize(true);
  });

  describe("creation function", () => {
    it("creates a new delivery", async () => {
      const group = await createGroup({
        name: "test-group-1",
        imageURL: "test-image-1",
      });

      const { delivery } = await createDelivery({
        idGroup: group.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-1",
      });

      expect(delivery).toHaveProperty("deliveryName", "test-delivery-1");
      expect(delivery).toHaveProperty("description", "test-description-1");
      expect(delivery).toHaveProperty("imageUrl", "test-image-1");
      expect(delivery).toHaveProperty("groupId", group.group.id);
    });
  });

  describe("udpate function", () => {
    it("handles invalid delivery id", async () => {
      const { error } = await updateDelivery({
        deliveryId: "invalid-id",
        deliveryName: "test-delivery-1",
      });

      expect(error).toBe("NOT_FOUND");
    });

    it("updates values correctly", async () => {
      const group = await createGroup({
        name: "test-group-1",
      });
      const delivery = await createDelivery({
        idGroup: group.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-1",
      });

      const ds = await getDataSource();
      expect(await ds.manager.find(DeliveryEnt)).toHaveLength(1);

      const updated = await updateDelivery({
        deliveryId: delivery.delivery.id,
        deliveryName: "test-delivery-2",
      });
      expect(updated).toHaveProperty(
        "delivery.deliveryName",
        "test-delivery-2",
      );
      expect(await ds.manager.find(DeliveryEnt)).toHaveLength(1);

      const updatedInDb = await ds.manager.findOneOrFail(DeliveryEnt, {
        where: { id: delivery.delivery.id },
      });
      expect(updatedInDb).toHaveProperty("deliveryName", "test-delivery-2");
      expect(updatedInDb).toHaveProperty("description", "test-description-1");
      expect(updatedInDb).toHaveProperty("imageUrl", "test-image-1");
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
        imageURL: "test-image-1",
      });

      const delivery = await createDelivery({
        idGroup: group.group.id,
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        imageUrl: "test-image-1",
      });

      const { userDelivery, error } = await setDeliverieToUser({
        idUser: user.user.id,
        idDeliverie: delivery.delivery.id,
        dateDelivery: new Date("2021-01-01"),
        status: "test-status-1",
        fileUrl: "test-file-url-1",
      });

      expect(error).toBeUndefined();
      expect(userDelivery).toHaveProperty("userId", user.user.id);
      expect(userDelivery).toHaveProperty("deliveryId", delivery.delivery.id);
      expect(userDelivery).toHaveProperty(
        "dateDelivery",
        new Date("2021-01-01"),
      );
      expect(userDelivery).toHaveProperty("status", "test-status-1");
      expect(userDelivery).toHaveProperty("fileUrl", "test-file-url-1");
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
        imageURL: "test-image-1",
      });

      const deliveryNames = Array.from(
        { length: 3 },
        (_, i) => `delivery-${i}`,
      );

      const deliveries = await Promise.all(
        deliveryNames.map((name) =>
          createDelivery({
            idGroup: group1.group.id,
            deliveryName: name,
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
            status: StatusUserDelivery.withoutSending,
            fileUrl: "test-file-url",
          }).then(({ userDelivery }) => userDelivery),
        ),
      );

      const data = await getUserDeliveriesbyGroup({
        userId: user.user.id,
        groupId: group1.group.id,
      });

      expect(data.userDeliveries).toHaveLength(3);
    });
  });

  describe("delete function", () => {
    it("handles non existing delivery", async () => {
      const ds = await getDataSource();
      const deliveries = await ds.manager.find(DeliveryEnt);
      expect(deliveries).toHaveLength(0);
      await deleteDelivery({ deliveryId: "non-existing-delivery-id" });
      expect(deliveries).toHaveLength(0);
    });

    it("deletes delivery correctly", async () => {
      const ds = await getDataSource();

      const { group } = await createGroup({
        name: "test-group-1",
        description: "test-description-1",
      });
      const { delivery } = await createDelivery({
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        idGroup: group.id,
        imageUrl: "",
      });

      let deliveries = await ds.manager.find(DeliveryEnt);
      expect(deliveries).toHaveLength(1);
      expect(deliveries[0]).toHaveProperty("id");
      expect(deliveries[0]).toHaveProperty("deliveryName", "test-delivery-1");

      await deleteDelivery({ deliveryId: delivery.id });
      deliveries = await ds.manager.find(DeliveryEnt);
      expect(deliveries).toHaveLength(0);
    });

    it("deletes associated user deliveries", async () => {
      const ds = await getDataSource();

      const { group } = await createGroup({
        name: "test-group-1",
        description: "test-description-1",
      });
      const { user } = await createUser({
        email: "test-email-1@delta.tec.mx",
        password: "password",
      });
      const { delivery } = await createDelivery({
        deliveryName: "test-delivery-1",
        description: "test-description-1",
        idGroup: group.id,
        imageUrl: "",
      });
      await setDeliverieToUser({
        idUser: user.id,
        idDeliverie: delivery.id,
        dateDelivery: new Date("2021-01-01"),
        fileUrl: "",
      });

      let deliveries = await ds.manager.find(DeliveryEnt);
      expect(deliveries).toHaveLength(1);
      expect(deliveries[0]).toHaveProperty("id");
      expect(deliveries[0]).toHaveProperty("deliveryName", "test-delivery-1");
      let userDeliveries = await ds.manager.find(UserDeliveryEnt);
      expect(userDeliveries).toHaveLength(1);

      await deleteDelivery({ deliveryId: delivery.id });
      deliveries = await ds.manager.find(DeliveryEnt);
      userDeliveries = await ds.manager.find(UserDeliveryEnt);
      expect(deliveries).toHaveLength(0);
      expect(userDeliveries).toHaveLength(0);
    });
  });
});
