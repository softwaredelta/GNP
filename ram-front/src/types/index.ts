// (c) Delta Software 2023, rights reserved.

export interface IRoute {
  path: string;
  Component: () => JSX.Element;
}

export type UserRole = "admin" | "manager" | "regular";

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
  statusName: string;
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

export interface IProspectStatus {
  id: string;
  updatedStatusDate: Date;
  statusComment: string;
  prospect: IProspect;
  prospectId: string;
  status: IStatus;
  statusId: string;
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
  user?: Partial<IUser>;
  status: DeliveryStatus;
  delivery?: IDelivery;
  group?: IGroup;
  deliveryId: string;
}

export interface IOrigin {
  id: string;
  name: string;
  description: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IState {
  id: string;
  name: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLevel {
  id: string;
  name: string;
  user: IUser[];
}

export interface IUser {
  id: string;
  origin?: IOrigin;
  state?: IState;
  level?: IUserLevel;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  mobile?: number;
  sell: ISell[];
  phone?: number;
  registerDate: Date;
  imageURL: string;
  roleString: string;
  roles: UserRole[];
  createdAt?: Date;
  updatedAt?: Date;
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
  description?: string;
  imageURL: string;
  progress: number;
  groupUsers?: Partial<IUser>[];
  deliveries?: IDelivery[];
  userDeliveries?: IUserDelivery[];
}

export interface IProspect {
  id: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  prospectStatus: IProspectStatus[];
  user: IUser;
  userId: string;
  createdAt: Date;
  updateAt: Date;
}
