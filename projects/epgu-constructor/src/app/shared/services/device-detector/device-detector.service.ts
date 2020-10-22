import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadService } from 'epgu-lib';
import { LOCAL_STORAGE_PLATFORM_TYPE } from '../../../config/config.types';

export enum LoadServiceDeviceType {
  'desk'= 'desk',
  'mob'= 'mob',
  'tab'= 'tab',
}


@Injectable()
export class DeviceDetectorService {

  // Определение платформы не работает локально, потому что информация приходит от сервера node,
  // который есть на портале но нет у нас. Там использует пакет ismobilejs.

  private _isMobile = new BehaviorSubject<boolean>(false);
  get isMobile(): boolean {
    return this._isMobile.getValue();
  }
  public isMobile$ = this._isMobile.asObservable();
  private _isTablet = new BehaviorSubject<boolean>(false);
  get isTablet(): boolean {
    return this._isTablet.getValue();
  }
  public isTablet$ = this._isTablet.asObservable();
  private _isDesktop = new BehaviorSubject<boolean>(false);
  get isDesktop(): boolean {
    return this._isDesktop.getValue();
  }
  public isDesktop$ = this._isDesktop.asObservable();

  constructor (private loadService: LoadService) {
    this.initState();
  }

  initState() {
    const defaultDeviceType = localStorage.getItem(LOCAL_STORAGE_PLATFORM_TYPE);
    const { deviceType = defaultDeviceType } = this.loadService.attributes;
    this._isMobile.next(deviceType === LoadServiceDeviceType.mob);
    this._isTablet.next(deviceType === LoadServiceDeviceType.tab);
    this._isDesktop.next(deviceType === LoadServiceDeviceType.desk);
    console.log('deviceType:', deviceType);
  }
}
