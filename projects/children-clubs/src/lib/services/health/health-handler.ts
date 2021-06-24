import { HealthPayload } from '@epgu/epgu-constructor-types';

export interface CommonPayload extends HealthPayload {
  appComponent: string;
}

export const CONFIG_API_REQUEST_SUB = 'config/';
