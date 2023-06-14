// (c) Delta Software 2023, rights reserved.
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { AssuranceTypeEnt } from "./assurance-type.entity";
import { UserEnt } from "./user.entity";
import {
  CUSTOM_NAME_COLUMN,
  ID_COLUMN,
  ID_STRING_COLUMN,
  MONEY_COLUMN,
  NAME_COLUMN,
  POLICY_NUMBER_COLUMN,
  REQUIRED_DATE_COLUMN,
  REQUIRED_STRING_COLUMN,
} from "./columns";
import { URL_COLUMN } from "./columns";
import { v4 } from "uuid";

@Entity({ name: "sell" })
export class SellEnt {
  @Column(ID_STRING_COLUMN("id"))
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
  paidDate!: Date;

  @Column(REQUIRED_DATE_COLUMN)
  emissionDate!: Date;

  @Column(REQUIRED_STRING_COLUMN("status"))
  status!: string;

  @Column(MONEY_COLUMN)
  yearlyFee!: string;

  @Column(MONEY_COLUMN)
  paidFee!: string;

  @Column(CUSTOM_NAME_COLUMN)
  insuredCostumer!: string;

  @Column(NAME_COLUMN)
  contractingClient!: string;

  @Column(REQUIRED_STRING_COLUMN("periodicity"))
  periodicity!: string;

  @Column(URL_COLUMN)
  evidenceUrl!: string;

  @BeforeInsert()
  async addId() {
    this.id = v4();
  }
}
