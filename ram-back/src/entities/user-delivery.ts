// (c) Delta Software 2023, rights reserved.

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEnt } from "./user.entity";
import {
  REQUIRED_DATE_COLUMN,
  REQUIRED_STRING_COLUMN,
  URL_COLUMN,
} from "./columns";
import { DeliveryEnt } from "./delivery.entity";

@Entity({ name: "user_delivery" })
export class UserDeliveryEnt {
  @ManyToOne(() => UserEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @PrimaryColumn({ name: "user_id", nullable: false })
  userId!: string;

  @ManyToOne(() => DeliveryEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "delivery_id" })
  delivery!: string;

  @PrimaryColumn({ name: "delivery_id", nullable: false })
  deliveryId!: string;

  @Column(REQUIRED_DATE_COLUMN)
  dateDelivery!: Date;

  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: string;

  @Column(URL_COLUMN)
  fileUrl!: string;
}
