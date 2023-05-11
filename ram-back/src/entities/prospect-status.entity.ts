// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StatusEnt } from "./status.entity";
import { ProspectEnt } from "./prospect.entity";
import { ID_COLUMN } from "./columns";

@Entity({ name: "prospect_status" })
export class ProspectStatusEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  updatedStatusDate: Date;

  @Column()
  statusComment: string;

  @ManyToOne(() => ProspectEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prospect_id" })
  prospect!: ProspectEnt;

  @Column(ID_COLUMN("prospect_id", { primary: false, nullable: true }))
  prospectId!: string;

  @ManyToOne(() => StatusEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "status_id" })
  status!: StatusEnt;

  @Column(ID_COLUMN("status_id", { primary: false, nullable: true }))
  statusId!: string;
}
