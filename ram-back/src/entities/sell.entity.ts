// (c) Delta Software 2023, rights reserved.
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AssuranceTypeEnt } from "./assurance-type.entity";
import { UserEnt } from "./user.entity";
import {
  MONEY_COLUMN,
  NAME_COLUMN,
  POLICY_NUMBER_COLUMN,
  REQUIRED_DATE_COLUMN,
  REQUIRED_STRING_COLUMN,
} from "./columns";
import { URL_COLUMN } from "./columns";

@Entity({ name: "sell" })
export class SellEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(POLICY_NUMBER_COLUMN)
  policyNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedtAt!: Date;

  @ManyToOne(() => AssuranceTypeEnt)
  assuranceType!: AssuranceTypeEnt;

  @OneToOne(() => UserEnt)
  user!: UserEnt;

  @Column(REQUIRED_DATE_COLUMN)
  sellDate!: Date;

  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: string;

  @Column(MONEY_COLUMN)
  amountInCents!: string;

  @Column(NAME_COLUMN)
  clientName!: string;

  @Column(REQUIRED_STRING_COLUMN("periodicity"))
  periodicity!: string;

  @Column(URL_COLUMN)
  evidenceUrl!: string;
}
