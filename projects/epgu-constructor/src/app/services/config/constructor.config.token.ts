import { InjectionToken } from '@angular/core';
import { FormPlayerConfigInterface } from '../../../interfaces/form-player-config.interface';


export const CONSTRUCTOR_CONFIG_TOKEN =
  new InjectionToken<FormPlayerConfigInterface>('constructor.detector.config');
