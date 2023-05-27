// (c) Delta Software 2023, rights reserved.
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ID_COLUMN, URL_COLUMN, NAME_COLUMN } from "./columns";
import { UserEnt } from "./user.entity";

@Entity({ name: "user-link" })
export class UserLinkEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(URL_COLUMN)
  link!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @ManyToOne(() => UserEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column(ID_COLUMN("user_id", { primary: false, nullable: true }))
  userId!: string;
}
