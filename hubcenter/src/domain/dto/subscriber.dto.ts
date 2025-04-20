import { SubscriberStatus } from '../enum/subscriber.enum';

export class SubscriberCreateParamsDTO {
  serverName: string;
  gitUrl: string;
  authData: string;
  deviceId: string;
  serverType: string;
  customData: string;
}

export class SubscriberStartDTO {
  deviceId: string;
  authData: string;
}

export class SubscriberUpdateStatusDTO {
  id: string;
  status: SubscriberStatus;
}

export class SubscriptionDTO {
  subscriberId: string;
  publisherId: string;
}
