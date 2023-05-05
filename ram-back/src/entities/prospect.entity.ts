// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NAME_COLUMN } from "./columns";
import { ProspectStatusEnt } from "./prospect-status.entity";

@Entity({ name: "prospect" })
export class ProspectEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @Column()
  firstSurname!: string;

  @Column()
  secondSurname!: string;

  @OneToMany(
    () => ProspectStatusEnt,
    (prospectStatus) => prospectStatus.prospect,
  )
  prospectStatus!: ProspectStatusEnt[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;
}
