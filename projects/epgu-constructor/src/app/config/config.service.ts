import { Inject, Injectable } from '@angular/core';
import { Config } from './config.types';
import { CONFIG_TOKEN } from './config.token';

@Injectable()
export class ConfigService {
  private readonly _config: Config;

  constructor(@Inject(CONFIG_TOKEN) config: Config) {
    this.checkConfig(config);
    this._config = config;
  }

  checkConfig(config: Config) {
    if (!config) {
      throw Error('Please set config at FormPlayerModule.forRoot()');
    }
  }

  get config(): Config {
    return this._config;
  }
}
