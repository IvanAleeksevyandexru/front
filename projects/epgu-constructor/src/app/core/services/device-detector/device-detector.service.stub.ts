import { Injectable } from '@angular/core';

@Injectable()
export class DeviceDetectorServiceStub {

  isMobile = false;
  isTablet = false;
  isDesktop = false;
  isWebView = true;

  initState() {}
}
