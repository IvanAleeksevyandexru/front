import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig, LOCAL_STORAGE_KEY } from './app.type';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { LoadServiceDeviceType } from '../../projects/epgu-constructor/src/app/core/services/device-detector/device-detector.service';
import { LOCAL_STORAGE_PLATFORM_TYPE } from '../../projects/epgu-constructor/src/app/core/config/config.types';
import { DeviceDetectorService } from 'ngx-device-detector';

const initValues: AppConfig = {
  serviceId: environment.serviceId,
  targetId: environment.targetId,
  orderId: environment.orderId,
  invited: false,
  canStartNew: true,
  initState: null,
}

@Injectable()
export class AppService {
  config: AppConfig;

  configSubject = new BehaviorSubject<AppConfig>(this.config);
  config$ = this.configSubject.asObservable();

  constructor (private route: ActivatedRoute, private ngxDeviceDetector: DeviceDetectorService) {
    this.initConfig();
  }

  valuesFromQueryParams(): void {
    const { serviceId, targetId, orderId, invited, canStartNew } = this.route.snapshot.queryParams;
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
    if(canStartNew) {
      this.config.canStartNew = canStartNew;
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

  initDeviceType() {
    this.saveDeviceTypeInStorage();
  }

  private saveDeviceTypeInStorage() {
    let getType = (): LoadServiceDeviceType => {
      if (this.ngxDeviceDetector.isMobile()) {
        return LoadServiceDeviceType.mob;
      } else if (this.ngxDeviceDetector.isTablet()) {
        return LoadServiceDeviceType.tab;
      } else {
        return LoadServiceDeviceType.desk;
      }
    };
    localStorage.setItem(LOCAL_STORAGE_PLATFORM_TYPE, getType());
  }
}
