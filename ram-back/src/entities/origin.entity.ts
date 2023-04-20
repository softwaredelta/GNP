// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DESCRIPTION_COLUMN, NAME_COLUMN } from "./columns";
import { UserEnt } from "./user.entity";

@Entity({ name: "origin" })
export class OriginEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @Column(DESCRIPTION_COLUMN)
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;

  @OneToOne(() => UserEnt, (user) => user.origin)
  user: UserEnt;
}
