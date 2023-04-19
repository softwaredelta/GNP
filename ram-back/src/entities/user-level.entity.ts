// (c) Delta Software 2023, rights reserved.

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NAME_COLUMN } from "./columns";
import { UserEnt } from "./user.entity";

@Entity({ name: "user_level" })
export class UserLevelEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @OneToMany(() => UserEnt, (user) => user.level)
  users: UserEnt[];
}
