// (c) Delta Software 2023, rights reserved.

import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEnt } from "./user.entity";
import {
  NAME_COLUMN,
  REQUIRED_DATE_COLUMN,
  REQUIRED_STRING_COLUMN,
  URL_COLUMN,
} from "./columns";
import { DeliveryEnt } from "./delivery.entity";

@Entity({ name: "user_delivery" })
export class UserDeliveryEnt {
  @ManyToOne(() => UserEnt, (userEnt) => userEnt.id)
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column({ name: "user_id", nullable: false, primary: true })
  userId!: string;

  @ManyToOne(() => DeliveryEnt, (deliveryEnt) => deliveryEnt.userDeliveries)
  delivery!: DeliveryEnt;

  @Column({ name: "delivery_id", nullable: false, primary: true })
  deliveryId!: string;

  @Column(REQUIRED_DATE_COLUMN)
  dateDelivery!: Date;

  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: string;

  @Column(URL_COLUMN)
  fileUrl!: string;
}
