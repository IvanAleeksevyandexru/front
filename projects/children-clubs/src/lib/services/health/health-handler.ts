import { HealthPayload } from '@epgu/epgu-constructor-types';

export interface CommonPayload extends HealthPayload {
  appComponent: string;
}
