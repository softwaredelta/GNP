// (c) Delta Software 2023, rights reserved.

import {
  AfterLoad,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  DATE_COLUMN,
  LAST_NAME_COLUMN,
  NAME_COLUMN,
  PASSWORD_COLUMN,
  REQUIRED_STRING_COLUMN,
  TELEPHONE_COLUMN,
  URL_COLUMN,
  USERNAME_COLUMN,
} from "./columns";
import { GroupUserEnt } from "./group-user.entity";
import { OriginEnt } from "./origin.entity";
import { SellEnt } from "./sell.entity";
import { StateEnt } from "./state.entity";
import { UserLevelEnt } from "./user-level.entity";

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  REGULAR = "regular",
}

export function buildRoleString(roles: UserRole[]): string {
  return roles.join(",");
}

export function rolesFromString(roles: string): UserRole[] {
  return roles.split(",") as UserRole[];
}

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

  // @ManyToMany(() => RoleEnt, (role) => role.users)
  // roles: RoleEnt[];

  @ManyToOne(() => UserLevelEnt, (level) => level.users, { eager: true })
  level: UserLevelEnt;

  @Column(USERNAME_COLUMN)
  email = "";

  @Column(NAME_COLUMN)
  name = "";

  @Column(LAST_NAME_COLUMN)
  lastName = "";

  @Column(PASSWORD_COLUMN)
  password = "";

  @Column(TELEPHONE_COLUMN)
  mobile!: number;

  @OneToMany(() => SellEnt, (sell) => sell.user)
  sell!: SellEnt[];

  @OneToMany(() => GroupUserEnt, (groupUser) => groupUser.user)
  groupUsers: GroupUserEnt[];

  @Column(TELEPHONE_COLUMN)
  phone!: number;

  @Column(DATE_COLUMN)
  registerDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column(URL_COLUMN)
  imageURL?: string;

  @Column(REQUIRED_STRING_COLUMN("roles"))
  rolesString!: string;

  roles!: UserRole[];

  @AfterLoad()
  async afterLoad() {
    this.roles = this.rolesString ? rolesFromString(this.rolesString) : [];
  }

  @AfterUpdate()
  async afterUpdate() {
    this.roles = this.rolesString ? rolesFromString(this.rolesString) : [];
  }

  hasRole(role: UserRole): boolean {
    return this.roles?.includes(role) || false;
  }
}
