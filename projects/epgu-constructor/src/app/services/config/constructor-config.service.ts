import { Inject, Injectable } from '@angular/core';
import { FormPlayerConfigInterface } from '../../../interfaces/form-player-config.interface';
import { CONSTRUCTOR_CONFIG_TOKEN } from './constructor.config.token';

@Injectable()
export class ConstructorConfigService {

  config: FormPlayerConfigInterface;
  constructor(
    @Inject(CONSTRUCTOR_CONFIG_TOKEN) constructorConfig: FormPlayerConfigInterface,
  ) {
    this.config = constructorConfig;
  }
}
