// (c) Delta Software 2023, rights reserved.

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { RoleEnt } from "./role.entity";
import { DESCRIPTION_COLUMN, NAME_COLUMN } from "./columns";

@Entity({ name: "module" })
export class ModuleEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(NAME_COLUMN)
  name!: string;

  @Column(DESCRIPTION_COLUMN)
  description: string;

  @ManyToMany(() => RoleEnt, (role) => role.modules)
  roles!: RoleEnt[];
}
