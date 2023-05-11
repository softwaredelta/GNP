// (c) Delta Software 2023, rights reserved.

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusEnt } from "./status.entity";
import { ProspectEnt } from "./prospect.entity";

@Entity({ name: "prospect_status" })
export class ProspectStatusEnt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  updateStatusDate!: Date;

  @Column()
  statusComment!: string;

  @ManyToOne(() => ProspectEnt, (prospect) => prospect.prospectStatus)
  prospect!: ProspectEnt;

  @ManyToOne(() => StatusEnt, (status) => status.prospectStatus)
  status!: StatusEnt;
}
