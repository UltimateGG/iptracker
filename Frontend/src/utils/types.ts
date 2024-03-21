export interface Auditable {
  createdAt: string; // TODO: Not sure what format of date this is
  createdBy: string; // Username
  modifiedAt: string;
  modifiedBy: string; // Username
}

export interface Application extends Auditable {
  id: number;
  description: string;
  servers: Server[];
}

export interface Server extends Auditable {
  id: number;
  appInfoId: number;
  sourceHostname: string;
  sourceIpAddress: string;
  destinationHostname: string;
  destinationIpAddress: string;
  destinationPort: number;
  isEnabled: boolean;
}

export enum UserRole {
  USER,
  ADMIN
}

export interface User extends Auditable {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  apps: Application[];
}

export interface APIError {
  error: boolean;
  status: number;
  message: string;
}
