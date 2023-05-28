// (c) Delta Software 2023, rights reserved.

import { DataSource } from "typeorm";
import { getDataSource } from "../../arch/db-client";
import {
  createDelivery,
  createLinkDelivery,
  deleteLinkDelivery,
  updateLinkDelivery,
} from "../../app/deliveries";
import { createGroup } from "../../app/groups";
import { DeliveryLinkEnt } from "../../entities/delivery-link.entity";

describe("delivery links", () => {
  let ds: DataSource;
  beforeEach(async () => {
    ds = await getDataSource();
    await ds.synchronize(true);
  });

  it("test create a new link into a delivery", async () => {
    const group = await createGroup({
      name: "test-group-1",
      imageUrl: "test-image-1",
    });

    const delivery = await createDelivery({
      idGroup: group.group.id,
      deliveryName: "test-delivery-1",
      description: "test-description-1",
      imageUrl: "test-image-1",
    });

    const { link } = await createLinkDelivery({
      deliveryId: delivery.delivery.id,
      link: "test-link-1",
      name: "test-name-1",
    });
    expect(link).toHaveProperty("link", "test-link-1");
    expect(link).toHaveProperty("name", "test-name-1");
    expect(link).toHaveProperty("deliveryId", delivery.delivery.id);
  });

  it("test update a link from a delivery", async () => {
    const group = await createGroup({
      name: "test-group-1",
      imageUrl: "test-image-1",
    });

    const delivery = await createDelivery({
      idGroup: group.group.id,
      deliveryName: "test-delivery-1",
      description: "test-description-1",
      imageUrl: "test-image-1",
    });

    const { link } = await createLinkDelivery({
      deliveryId: delivery.delivery.id,
      link: "test-link-1",
      name: "test-name-1",
    });

    const { link: linkUpdated } = await updateLinkDelivery({
      id: link.id,
      link: "test-link-2",
      name: "test-name-2",
    });
    expect(linkUpdated).toHaveProperty("link", "test-link-2");
    expect(linkUpdated).toHaveProperty("name", "test-name-2");
    expect(linkUpdated).toHaveProperty("deliveryId", delivery.delivery.id);
  });

  it("test update a link from a delivery with invalid id", async () => {
    const { error } = await updateLinkDelivery({
      id: "invalid-id",
      link: "test-link-2",
      name: "test-name-2",
    });
    expect(error).toBe("NOT_FOUND");
  });

  it("deletes a link from a delivery", async () => {
    const group = await createGroup({
      name: "test-group-1",
      imageUrl: "test-image-1",
    });

    const delivery = await createDelivery({
      idGroup: group.group.id,
      deliveryName: "test-delivery-1",
      description: "test-description-1",
      imageUrl: "test-image-1",
    });

    const { link } = await createLinkDelivery({
      deliveryId: delivery.delivery.id,
      link: "test-link-1",
      name: "test-name-1",
    });

    await deleteLinkDelivery({ id: link.id });
    const links = await ds.manager.find(DeliveryLinkEnt);
    expect(links).toHaveLength(0);
  });
});
