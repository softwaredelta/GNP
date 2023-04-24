// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { DESCRIPTION_COLUMN, URL_COLUMN } from "./columns";
import { UserDeliveryEnt } from "./user-delivery";
import { UserEnt } from "./user.entity";
import { GroupEnt } from "./group.entity";

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

  @ManyToOne(() => GroupEnt, (groupEnt) => groupEnt.id)
  @JoinColumn({ name: "group_id" })
  group!: GroupEnt;

  @Column({ name: "group_id", nullable: false, primary: true })
  groupId!: string;

  @OneToMany(() => UserDeliveryEnt, (userDelivery) => userDelivery.delivery)
  userDeliveries: UserDeliveryEnt[];
}
