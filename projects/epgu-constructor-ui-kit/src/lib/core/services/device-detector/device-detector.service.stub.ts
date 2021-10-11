import { Injectable } from '@angular/core';
import { System } from './device-detector.types';

@Injectable()
export class DeviceDetectorServiceStub {
  isMobile = false;
  isTablet = false;
  isDesktop = false;
  isWebView = false;

  initState() {}

  initSmuEventsService() {}

  get system() {
    return System.NotDetermined;
  }
}
