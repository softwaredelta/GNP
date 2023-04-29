// (c) Delta Software 2023, rights reserved.
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { AssuranceTypeEnt } from "./assurance-type.entity";
import { UserEnt } from "./user.entity";
import {
  ID_COLUMN,
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
  @JoinColumn({ name: "assurance_type_id" })
  assuranceType!: AssuranceTypeEnt;

  @Column(ID_COLUMN("assurance_type_id", { primary: false, nullable: true }))
  assuranceTypeId!: string;

  @ManyToOne(() => UserEnt, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column(ID_COLUMN("user_id", { primary: false, nullable: true }))
  userId!: string;

  @Column(REQUIRED_DATE_COLUMN)
  sellDate!: Date;

  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: string;

  @Column(MONEY_COLUMN)
  amountInCents!: number;

  @Column(NAME_COLUMN)
  clientName!: string;

  @Column(REQUIRED_STRING_COLUMN("periodicity"))
  periodicity!: string;

  @Column(URL_COLUMN)
  evidenceUrl!: string;
}
