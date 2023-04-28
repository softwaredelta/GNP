// (c) Delta Software 2023, rights reserved.

import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEnt } from "./user.entity";
import {
  ID_COLUMN,
  REQUIRED_DATE_COLUMN,
  REQUIRED_STRING_COLUMN,
  URL_COLUMN,
} from "./columns";
import { DeliveryEnt } from "./delivery.entity";

export enum StatusUserDelivery {
  withoutSending = "Sin enviar",
  sending = "Enviado",
  refused = "Rechazado",
  accepted = "Aceptado",
}

@Entity({ name: "user_delivery" })
export class UserDeliveryEnt {
  @ManyToOne(() => UserEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEnt;

  @Column(ID_COLUMN("user_id"))
  userId!: string;

  @ManyToOne(() => DeliveryEnt, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "delivery_id" })
  delivery!: DeliveryEnt;

  @Column(ID_COLUMN("delivery_id"))
  deliveryId!: string;

  @Column(REQUIRED_DATE_COLUMN)
  dateDelivery!: Date;

  @Column(
    REQUIRED_STRING_COLUMN("status", {
      defaultValue: StatusUserDelivery.withoutSending,
    }),
  )
  status!: string;

  @Column(URL_COLUMN)
  fileUrl!: string;
}
