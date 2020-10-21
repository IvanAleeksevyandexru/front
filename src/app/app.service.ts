import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from './app.type';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';

export const LOCAL_STORAGE_KEY = 'EPGU_FORM_PLAYER_TEST_STAND_CONFIG';

const initValues: AppConfig = {
  serviceId: environment.serviceId,
  targetId: environment.targetId,
  orderId: environment.orderId,
  invited: false
}

@Injectable()
export class AppService {
  config: AppConfig;

  configSubject = new BehaviorSubject(this.config);
  config$ = this.configSubject.asObservable();

  constructor (private route: ActivatedRoute) {
    this.initConfig();
  }

  valuesFromQueryParams(): void {
    const { serviceId, targetId, orderId, invited } = this.route.snapshot.queryParams;
    if(serviceId) {
      this.config.serviceId = serviceId;
    }
    if(targetId) {
      this.config.targetId = targetId;
    }
    if(orderId) {
      this.config.orderId = orderId;
    }
    if(invited) {
      this.config.invited = invited;
    }
  }

  saveConfig(newConfig: AppConfig) {
    this.config = newConfig;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.config));
    this.configSubject.next(this.config)
  }

  initConfig() {
    const savedConfigRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    let savedConfig: AppConfig;
    if (savedConfigRaw) {
      savedConfig = JSON.parse(savedConfigRaw) as AppConfig;
    }

    const initConfig = this.getInitConfigs();
    if (savedConfig) {
      this.removeNotExistingFieldsFromSavedConfig(savedConfig, initConfig)
    }

    this.config = {
      ...initConfig,
      ...savedConfig
    }
    this.valuesFromQueryParams();
    this.configSubject.next(this.config)
  }

  getInitConfigs() {
    return {
      ...initValues,
    }
  }

  removeNotExistingFieldsFromSavedConfig(savedConfig: AppConfig, initConfig: AppConfig) {
    const savedKeys = Object.keys(savedConfig);
    const initKeys = Object.keys(initConfig);
    const oldKeys = [];

    savedKeys.forEach(savedKey => {
      if(!initKeys.includes(savedKey)) {
        oldKeys.push(savedKey);
      }
    });

    oldKeys.forEach(key => {
      delete savedConfig[key]
    });
  }

  resetConfig() {
    let config = this.config;
    config = { ...initValues, ...config };
    this.saveConfig(config);
  }
}
