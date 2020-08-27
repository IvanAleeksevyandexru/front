import { InjectionToken } from '@angular/core';
import { ConstructorConfigInterface } from '../../../interfaces/constructor-config.interface';


export const CONSTRUCTOR_CONFIG_TOKEN =
  new InjectionToken<ConstructorConfigInterface>('constructor.detector.config');
