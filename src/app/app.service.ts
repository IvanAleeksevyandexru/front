import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from './app.type'
import { getConfigFromEnvs } from './app.utils'

const LOCAL_STORAGE_KEY = 'EPGU_FORM_PLAYER_TEST_STAND_CONFIG';

@Injectable()
export class AppService {
  config: AppConfig;

  configSubject = new BehaviorSubject(this.config);
  config$ = this.configSubject.asObservable();

  constructor () {
    this.initConfig();
  }

  saveConfig(newConfig: AppConfig) {
    this.config = newConfig;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.config));
    this.configSubject.next(this.config)
  }

  initConfig() {
    const savedConfig = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedConfig) {
      this.config = JSON.parse(savedConfig) as AppConfig;
    } else {
      this.config = {
        serviceId: '',
        ...getConfigFromEnvs()
      }
    }
    this.configSubject.next(this.config)
  }

  resetConfig() {
    let config = this.config;
    config = { ...config, ...getConfigFromEnvs() };
    this.saveConfig(config);
  }
}
