// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEnt } from "./user.entity";
import {
  REQUIRED_DATE_COLUMN,
  REQUIRED_STRING_COLUMN,
  URL_COLUMN,
} from "./columns";
import { DeliveryEnt } from "./delivery.entity";

@Entity({ name: "user_delivery" })
export class UserDeliveryEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => UserEnt, (userEnt) => userEnt.id)
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column({ name: "user_id", nullable: false, primary: true })
  userId!: string;

  @ManyToOne(() => DeliveryEnt, (deliveryEnt) => deliveryEnt.userDeliveries)
  @JoinColumn({ name: "delivery_id" })
  delivery!: DeliveryEnt;

  @Column({ name: "delivery_id", nullable: false, primary: true })
  deliveryId!: string;

  @Column(REQUIRED_DATE_COLUMN)
  dateDelivery!: Date;

  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: string;

  @Column(URL_COLUMN)
  fileUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
