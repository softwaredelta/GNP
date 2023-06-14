// (c) Delta Software 2023, rights reserved.

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import {
  DESCRIPTION_COLUMN,
  ID_STRING_COLUMN,
  UNIQUE_NAME_COLUMN,
} from "./columns";
import { GoalEnt } from "./goal.entity";
import { SellEnt } from "./sell.entity";
import { v4 } from "uuid";

@Entity({ name: "assurance_type" })
export class AssuranceTypeEnt {
  @Column(ID_STRING_COLUMN("id"))
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;

  @Column(UNIQUE_NAME_COLUMN)
  name: string;

  @Column(DESCRIPTION_COLUMN)
  description: string;

  @OneToMany(() => GoalEnt, (goal) => goal.assuranceType)
  goals: GoalEnt[];

  @OneToMany(() => SellEnt, (sell) => sell.assuranceType)
  sales: SellEnt[];

  @BeforeInsert()
  async addId() {
    this.id = v4();
  }
}
