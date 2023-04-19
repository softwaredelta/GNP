// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoleEnt } from "./role.entity";
import { OriginEnt } from "./origin.entity";
import { StateEnt } from "./state.entity";
import {
  DATE_COLUMN,
  PASSWORD_COLUMN,
  TELEPHONE_COLUMN,
  URL_COLUMN,
  USERNAME_COLUMN,
} from "./columns";
import { UserLevelEnt } from "./user-level.entity";

@Entity({ name: "user" })
export class UserEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => OriginEnt, (origin) => origin.user)
  @JoinColumn()
  origin: OriginEnt;

  @OneToOne(() => StateEnt)
  @JoinColumn()
  state: StateEnt;

  @ManyToMany(() => RoleEnt, (role) => role.users)
  roles: RoleEnt[];

  @ManyToOne(() => UserLevelEnt, (level) => level.users, { eager: true })
  level: UserLevelEnt;

  @Column(USERNAME_COLUMN)
  email = "";

  @Column(PASSWORD_COLUMN)
  password = "";

  @Column(TELEPHONE_COLUMN)
  mobile!: number;

  @Column(TELEPHONE_COLUMN)
  phone!: number;

  @Column(DATE_COLUMN)
  registerDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column(URL_COLUMN)
  imageUrl?: string;
}
