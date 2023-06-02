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
  id?: string;
  policyNumber: string;
  assuranceType?: IAssuranceType;
  paidDate?: Date | string;
  yearlyFee: string;
  contractingClient: string;
  status: string;
  periodicity: string;
  user?: IUser;
  evidenceUrl?: string;
  insuredCostumer: string;
  paidFee?: string;
  emissionDate?: Date;
  assuranceTypeId: string;
}

export interface IDelivery {
  id: string;
  deliveryName: string;
  description: string;
  imageUrl: string;
  userDeliveries?: IUserDelivery[];
  group?: IGroup;
  hasDelivery?: string;
}

export interface IDeliveryObject {
  delivery: IDelivery;
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
  id?: string;
  email: string;
  imageUrl?: string;
  name: string;
  lastName: string;
  origin?: string;
  state?: string;
  level?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: number;
  phone?: number;
  registerDate?: Date;
  role?: string;
  rolesString?: string;
  createdAt?: Date;
  CUA?: string;
  urlPP200?: string;
}

export interface IGroup {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  progress?: number;
  groupUsers?: IUser[];
  deliveries: IDelivery[];
  userDeliveries?: IUserDelivery[];
}

export interface IProspect {
  id: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  state: string;
  prospectStatus: {
    status: IStatus;
    statusComment: string;
  }[];
}

export interface IStatusProspect {
  id?: string;
  updatedStatusDate?: Date;
  statusComment?: string;
  prospectId?: string;
  statusId?: string;
  status?: Status;
}

export interface Status {
  id: string;
  statusName: string;
}

export interface IMembers {
  id: string;
  rol: string;
  name: string;
  lastName: string;
  isActive: number;
  imageUrl: string;
  email: string;
}

export interface ILink {
  id: string;
  link: string;
  name: string;
}

export interface IDeliveryDescription {
  id: string;
  deliveryName: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  imageUrl: string;
  groupId: string;
  hasDelivery: string;
  deliveryLinks: ILink[];
}
