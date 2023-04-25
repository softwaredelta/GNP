// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DESCRIPTION_COLUMN, NAME_COLUMN, URL_COLUMN } from "./columns";
import { GroupUserEnt } from "./group-user.entity";
import { DeliveryEnt } from "./delivery.entity";

@Entity({ name: "group" })
export class GroupEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @Column(DESCRIPTION_COLUMN)
  image!: string;

  @Column(DESCRIPTION_COLUMN)
  description: string;

  @Column(URL_COLUMN)
  imageURL!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;

  @OneToMany(() => GroupUserEnt, (groupUser) => groupUser.group)
  groupUsers!: GroupUserEnt[];

  @OneToMany(() => DeliveryEnt, (userDeliveries) => userDeliveries.group)
  deliveries!: DeliveryEnt[];

  @OneToMany(() => DeliveryEnt, (groupDelivery) => groupDelivery.group)
  groupDeliveries!: DeliveryEnt[];
}
