import { InjectionToken } from '@angular/core';
import { Config } from './config.types';


export const CONFIG_TOKEN =
  new InjectionToken<Config>('form-player.detector.config');
