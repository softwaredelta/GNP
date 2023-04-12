// (c) Delta Software 2023, rights reserved.

import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "user" })
export class UserEnt {
  @PrimaryColumn({ nullable: false, type: "varchar", select: true })
  id!: string;

  @Column({ nullable: false, type: "varchar", select: false })
  email = "";
}
