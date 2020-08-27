import { Inject, Injectable } from '@angular/core';
import { ConstructorConfigInterface } from '../../../interfaces/constructor-config.interface';
import { CONSTRUCTOR_CONFIG_TOKEN } from './constructor.config.token';

@Injectable()
export class ConstructorConfigService {

  config: ConstructorConfigInterface;
  constructor(
    @Inject(CONSTRUCTOR_CONFIG_TOKEN) constructorConfig: ConstructorConfigInterface,
  ) {
    this.config = constructorConfig;
  }
}
