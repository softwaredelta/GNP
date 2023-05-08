// (c) Delta Software 2023, rights reserved.

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProspectStatusEnt } from "./prospect-status.entity";

@Entity({ name: "status" })
export class StatusEnt {
  @PrimaryGeneratedColumn()
  idStatus!: number;

  @Column()
  statusName!: string;

  @OneToMany(() => ProspectStatusEnt, (prospectStatus) => prospectStatus.status)
  prospectStatus!: ProspectStatusEnt[];
}
