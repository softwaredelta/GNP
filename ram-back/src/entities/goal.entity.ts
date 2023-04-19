// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AssuranceTypeEnt } from "./assurance-type.entity";
import {
  DESCRIPTION_COLUMN,
  NAME_COLUMN,
  REQUIRED_DATE_COLUMN,
} from "./columns";

@Entity({ name: "goal" })
export class GoalEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;

  @ManyToOne(() => AssuranceTypeEnt, (assuranceType) => assuranceType.id, {
    nullable: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "assurance_type_id" })
  assuranceType!: AssuranceTypeEnt;

  @Column({ name: "assurance_type_id", nullable: true })
  assuranceTypeId!: string;

  @Column(NAME_COLUMN)
  name: string;

  @Column(DESCRIPTION_COLUMN)
  description: string;

  @Column(REQUIRED_DATE_COLUMN)
  initialDate: Date;

  @Column(REQUIRED_DATE_COLUMN)
  finalDate: Date;
}
