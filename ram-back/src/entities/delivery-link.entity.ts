// (c) Delta Software 2023, rights reserved.
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ID_COLUMN, URL_COLUMN } from "./columns";
import { DeliveryEnt } from "./delivery.entity";

@Entity({ name: "delivery-link" })
export class DeliveryLinkEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(URL_COLUMN)
  link!: string;

  @ManyToOne(() => DeliveryEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "delivery_id" })
  delivery!: DeliveryEnt;

  @Column(ID_COLUMN("delivery_id", { primary: false, nullable: true }))
  deliveryId!: string;
}
