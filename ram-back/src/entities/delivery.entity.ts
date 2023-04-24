// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DESCRIPTION_COLUMN, URL_COLUMN } from "./columns";
import { UserDeliveryEnt } from "./user-delivery";
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

  @OneToMany(() => UserDeliveryEnt, (userDelivery) => userDelivery.delivery)
  userDeliveries!: UserDeliveryEnt[];

  @ManyToOne(() => GroupEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "group_id" })
  group!: GroupEnt;

  @Column({ name: "group_id", nullable: false })
  groupId!: string;
}
