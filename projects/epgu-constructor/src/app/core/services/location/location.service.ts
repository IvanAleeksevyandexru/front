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

  reload(): void {
    this.window.location.reload();
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
