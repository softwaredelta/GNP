// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NAME_COLUMN, REQUIRED_STRING_COLUMN } from "./columns";

@Entity({ name: "state" })
export class StateEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name: string;

  @Column(REQUIRED_STRING_COLUMN("country"))
  country: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;
}
