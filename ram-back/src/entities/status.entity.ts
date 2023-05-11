// (c) Delta Software 2023, rights reserved.

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProspectStatusEnt } from "./prospect-status.entity";

export enum StatusNames {
  NEW = "Nuevo",
  CALL = "Llamada agendada",
  CONTRACT = "Contrato",
  RETIRED = "Retirado",
}

@Entity({ name: "status" })
export class StatusEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  statusName!: string;

  @OneToMany(
    () => ProspectStatusEnt,
    (prospectStatus) => prospectStatus.prospect,
  )
  prospectStatus!: ProspectStatusEnt[];
}
