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
export interface IStatus {
  id: string;
  date: Date;
  statusName: string;
  comments: string;
}

export interface ISell {
  id: string;
  policyNumber: string;
  assuranceType: IAssuranceType;
  paidDate: Date;
  yearlyFee: string;
  contractingClient: string;
  status: string;
  periodicity: string;
  user?: IUser;
  evidenceUrl: string;
}

export interface IDelivery {
  id: string;
  deliveryName: string;
  description: string;
  imageUrl: string;
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
  deliveryId: string;
}

export interface IUser {
  id: string;
  email: string;
  imageURL: string;
}

export interface IUserName {
  id: string;
  email: string;
  imageURL: string;
  name: string;
  lastName: string;
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

export interface IProspects {
  id: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  state: string;
  prospectStatus: {
    status: IStatus
    statusComment: string
  }[]
}