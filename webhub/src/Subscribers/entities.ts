import { SubscriberStatus } from '../types/subscriber';

export interface SubscriberEntity {
  id: string;
  serverName: string;
  status: SubscriberStatus;
  deviceId: string;
  authData: string;
  publisherIds: string;
  createdAt: number;
  lastConnectedAt: number;
  customData: string;
}

export interface SubscriberCreateParamsDTO {
  serverName: string;
  deviceId: string;
  authData: string;
  publisherIds: string[];
  customData?: string;
}
