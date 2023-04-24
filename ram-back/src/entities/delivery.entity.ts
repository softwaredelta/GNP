// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DESCRIPTION_COLUMN, URL_COLUMN } from "./columns";
import { UserDeliveryEnt } from "./user-delivery";

@Entity({ name: "delivery" })
export class DeliveryEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;

  @Column(DESCRIPTION_COLUMN)
  description: string;

  @Column(URL_COLUMN)
  imageUrl: string;

  @OneToMany(() => UserDeliveryEnt, (userDelivery) => userDelivery.delivery)
  userDeliveries: UserDeliveryEnt[];
}
