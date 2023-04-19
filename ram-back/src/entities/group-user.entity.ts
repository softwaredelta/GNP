// (c) Delta Software 2023, rights reserved.

import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { GroupEnt } from "./group.entity";
import { UserEnt } from "./user.entity";
import { REQUIRED_STRING_COLUMN } from "./columns";

export enum GroupUserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity({ name: "group_user" })
export class GroupUserEnt {
  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: GroupUserStatus;

  @ManyToOne(() => UserEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column({ name: "user_id", nullable: false, primary: true })
  userId!: string;

  @ManyToOne(() => GroupEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "group_id" })
  group!: GroupEnt;

  @Column({ name: "group_id", nullable: false, primary: true })
  groupId!: string;
}
