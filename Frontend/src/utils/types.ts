export interface Auditable {
  createdAt: string;
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
  password?: string;
  role: UserRole;
}

export interface APIError {
  error: boolean;
  status: number;
  message: string;
}

export enum SortDirection {
  ASC,
  DESC
}

export enum SortType {
  APPLICATION_ID = 'Application ID',
  CREATED_AT = 'Date Created',
  MODIFIED_AT = 'Last Modified',
  SERVER_COUNT = 'Server Count'
}

export interface SortState {
  direction: SortDirection;
  type: SortType;
}
