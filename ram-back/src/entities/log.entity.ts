// (c) Delta Software 2023, rights reserved.

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class LogEnt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  instanceId!: string;

  @Column()
  kind!: string;

  @Column()
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
