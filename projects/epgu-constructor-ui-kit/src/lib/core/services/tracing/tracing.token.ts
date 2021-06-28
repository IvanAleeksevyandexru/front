import { InjectionToken } from '@angular/core';

export type AllowedRemoteServices = Array<string>;

export const TRACE_ALLOWED_REMOTE_SERVICES = new InjectionToken<string>('epguHealthService');
