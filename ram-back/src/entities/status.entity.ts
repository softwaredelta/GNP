// (c) Delta Software 2023, rights reserved.

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProspectStatusEnt } from "./prospect-status.entity";
import { REQUIRED_STRING_COLUMN } from "./columns";

export enum StatusNames {
  NEW = "Nuevo prospecto",
  MEETING_ADDED = "Cita agendada",
  MEEETING_SUCCESSFUL = "Cita efectiva",
  REQUEST = "Solicitud de seguro",
  POLICY_PAID = "Poliza pagada",
  RETIRED = "Retirado",
}

@Entity({ name: "status" })
export class StatusEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column(REQUIRED_STRING_COLUMN("statusName"))
  statusName!: StatusNames;

  @OneToMany(
    () => ProspectStatusEnt,
    (prospectStatus) => prospectStatus.prospect,
  )
  prospectStatus!: ProspectStatusEnt[];
}
