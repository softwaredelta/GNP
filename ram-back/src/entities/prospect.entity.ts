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
import { ID_COLUMN, NAME_COLUMN } from "./columns";
import { ProspectStatusEnt } from "./prospect-status.entity";
import { UserEnt } from "./user.entity";

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

  @ManyToOne(() => UserEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column(ID_COLUMN("user_id", { primary: false }))
  userId!: string;
}
