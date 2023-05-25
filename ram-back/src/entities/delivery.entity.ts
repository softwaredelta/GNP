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
import { DESCRIPTION_COLUMN, ID_COLUMN, URL_COLUMN } from "./columns";
import { UserDeliveryEnt } from "./user-delivery.entity";
import { GroupEnt } from "./group.entity";
import { DeliveryLinkEnt } from "./delivery-link.entity";

@Entity({ name: "delivery" })
export class DeliveryEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(DESCRIPTION_COLUMN)
  deliveryName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column(DESCRIPTION_COLUMN)
  description: string;

  @Column(URL_COLUMN)
  imageUrl: string;

  @OneToMany(() => UserDeliveryEnt, (userDelivery) => userDelivery.delivery)
  userDeliveries!: UserDeliveryEnt[];

  @OneToMany(() => DeliveryLinkEnt, (deliveryLink) => deliveryLink.delivery)
  deliveryLinks!: DeliveryLinkEnt[];

  @ManyToOne(() => GroupEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "group_id" })
  group!: GroupEnt;

  @Column(ID_COLUMN("group_id", { primary: false }))
  groupId!: string;
}
