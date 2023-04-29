// (c) Delta Software 2023, rights reserved.

export interface IRoute {
  path: string;
  Component: () => JSX.Element;
}

export type DeliveryStatus =
  | "Sin enviar"
  | "Enviado"
  | "Rechazado"
  | "Aceptado";

export interface IAssuranceType {
  id: string;
  name: string;
  description: string;
}

export interface ISell {
  id: string;
  policyNumber: string;
  assuranceType: IAssuranceType;
  sellDate: Date;
  amountInCents: string;
  clientName: string;
  status: string;
  periodicity: string;
  user?: IUser;
  evidenceUrl: string;
}

export interface IDelivery {
  id: string;
  deliveryName: string;
  description: string;
  imageURL: string;
  userDeliveries?: IUserDelivery[];
  group?: IGroup;
}

export interface IUserDelivery {
  fileUrl: string;
  dateDelivery: string;
  user?: IUser;
  status: DeliveryStatus;
  delivery?: IDelivery;
  group?: IGroup;
}

export interface IUser {
  id: string;
  email: string;
  imageURL: string;
}

export interface IGroup {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  progress: number;
  groupUsers?: IUser[];
  deliveries?: IDelivery[];
  userDeliveries?: IUserDelivery[];
}
