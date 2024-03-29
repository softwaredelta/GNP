// (c) Delta Software 2023, rights reserved.

import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import {
  DATE_COLUMN,
  ID_STRING_COLUMN,
  IS_ACTIVE_COLUMN,
  LAST_NAME_COLUMN,
  NAME_COLUMN,
  PASSWORD_COLUMN,
  REQUIRED_STRING_COLUMN,
  TELEPHONE_COLUMN,
  UNIQUE_AGENT_KEY_COLUMN,
  URL_COLUMN,
  USERNAME_COLUMN,
} from "./columns";
import { GroupUserEnt } from "./group-user.entity";
import { OriginEnt } from "./origin.entity";
import { SellEnt } from "./sell.entity";
import { StateEnt } from "./state.entity";
import { UserLevelEnt } from "./user-level.entity";
import { UserLinkEnt } from "./user-link.entity";
import { v4 } from "uuid";

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

export function normalizeString(str: string): string {
  let newStr = str.toLowerCase().trim();
  newStr = newStr.replace(/\s\s+/g, " ");
  return newStr;
}

export function capitalizeString(str: string): string {
  const parts = str.split(" ");
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

@Entity({ name: "user_ent" })
export class UserEnt {
  @Column(ID_STRING_COLUMN("id"))
  id!: string;

  @OneToOne(() => OriginEnt, (origin) => origin.user)
  @JoinColumn()
  origin: OriginEnt;

  @OneToOne(() => StateEnt)
  @JoinColumn()
  state: StateEnt;

  @Column(UNIQUE_AGENT_KEY_COLUMN)
  CUA?: string;

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

  @Column(URL_COLUMN)
  urlPP200?: string;

  @OneToMany(() => SellEnt, (sell) => sell.user)
  sell!: SellEnt[];

  @OneToMany(() => GroupUserEnt, (groupUser) => groupUser.user)
  groupUsers: GroupUserEnt[];

  @OneToMany(() => UserLinkEnt, (userLink) => userLink.user)
  userLinks: UserLinkEnt[];

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

  @Column(IS_ACTIVE_COLUMN)
  isActive!: number;

  @Column(REQUIRED_STRING_COLUMN("roles"))
  rolesString!: string;

  roles!: UserRole[];

  @BeforeInsert()
  async beforeInsert() {
    this.id = v4();
    this.email = normalizeString(this.email);
    this.name = normalizeString(this.name);
    this.lastName = normalizeString(this.lastName);
  }

  @AfterInsert()
  async afterInsert() {
    this.name = capitalizeString(this.name);
    this.lastName = capitalizeString(this.lastName);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.email = normalizeString(this.email);
    this.name = normalizeString(this.name);
    this.lastName = normalizeString(this.lastName);
  }

  @AfterLoad()
  async afterLoad() {
    this.roles = this.rolesString ? rolesFromString(this.rolesString) : [];
    this.name = capitalizeString(this.name);
    this.lastName = capitalizeString(this.lastName);
  }

  @AfterUpdate()
  async afterUpdate() {
    this.roles = this.rolesString ? rolesFromString(this.rolesString) : [];
    this.name = capitalizeString(this.name);
    this.lastName = capitalizeString(this.lastName);
  }

  hasRole(role: UserRole): boolean {
    return this.roles?.includes(role) || false;
  }
}
