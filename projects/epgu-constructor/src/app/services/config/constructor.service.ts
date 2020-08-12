import {Inject, Injectable} from '@angular/core';
import {ConstructorConfigInterface} from '../../../interfaces/constructor-config.interface';
import {CONSTRUCTOR_CONFIG_TOKEN} from './constructor.config';

@Injectable()
export class ConstructorService {
  config: ConstructorConfigInterface;

  constructor(
    @Inject(CONSTRUCTOR_CONFIG_TOKEN) constructorConfig: ConstructorConfigInterface
  ) {
    this.config = constructorConfig;
  }
}
