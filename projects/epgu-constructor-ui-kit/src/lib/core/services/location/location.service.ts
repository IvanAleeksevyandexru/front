import { Inject, Injectable } from '@angular/core';
import { Location, LocationStrategy, PlatformLocation } from '@angular/common';
import { WINDOW } from '../../providers/window.provider';


@Injectable()
export class LocationService extends Location {
  constructor(
    @Inject(WINDOW) private window: Window,
    platformStrategy: LocationStrategy,
    platformLocation: PlatformLocation,
  ) {
    super(platformStrategy, platformLocation);
  }

  href(url: string, isInner: boolean = false): void {
    isInner ? this.go(url) : (this.window.location.href = url);
  }

  getHref(): string {
    return this.window.location.href;
  }

  getOrigin(): string {
    return this.window.location.origin;
  }

  reload(): void {
    this.window.location.reload();
  }

  hasParam(paramName: string): boolean {
    return this.path(true).includes(`${paramName}=`);
  }

  getParamValue(paramName: string): string {
    const urlParams = new URLSearchParams(this.window.location.search);
    return urlParams.get(paramName);
  }

  deleteParam(...paramNames: string[]): void {
    let params = this.window.location.search;
    if (params) {
      params = params.slice(1);
      paramNames.forEach((paramName) => {
        params = params.split('&').filter((param) => !param.includes(paramName)).join('&');
      });
      this.replaceState(this.window.location.pathname, params);
    }
  }
}
