// (c) Delta Software 2023, rights reserved.

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ModuleEnt } from "./module.entity";
import { DESCRIPTION_COLUMN, NAME_COLUMN } from "./columns";
import { UserEnt } from "./user.entity";

@Entity({ name: "role" })
export class RoleEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @Column(DESCRIPTION_COLUMN)
  description!: string;

  @ManyToMany(() => ModuleEnt, (module) => module.roles)
  @JoinTable({
    name: "role_module",
    joinColumn: {
      name: "role_id",
    },
    inverseJoinColumn: {
      name: "module_id",
    },
  })
  modules!: ModuleEnt[];

  @ManyToMany(() => UserEnt, (user) => user.roles)
  @JoinTable({
    name: "role_user",
    joinColumn: {
      name: "role_id",
    },
    inverseJoinColumn: {
      name: "user_id",
    },
  })
  users!: UserEnt[];
}
