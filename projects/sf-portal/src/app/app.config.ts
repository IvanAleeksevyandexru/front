/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, PLATFORM_ID, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LoadService } from '@epgu/ui/services/load';
import { CookieService } from 'ngx-cookie';
import isMobile from 'ismobilejs';
import { Inject } from '@angular/core';
import { LocationService, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { isPlatformServer } from '@angular/common';
import { HOST_URL } from './tokens/host-url.token';

@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  public static settings: any;
  private isServer = isPlatformServer(this.platformId);

  constructor(
    private http: HttpClient,
    private loadService: LoadService,
    private cookieService: CookieService,
    private locationService: LocationService,
    @Inject(WINDOW) private window: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(HOST_URL) private hostUrl: string,
  ) {}

  public load(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.fetchConfig()
        .then((response: any) => {
          AppConfig.settings = response;
          this.setWindowServerData(AppConfig.settings);
          if (this.cookieService.get('acc_t')) {
            return this.fetchUser();
          }

          return null;
        })
        .then((response: any) => {
          this.window.serverData.data.user = response || {};
        })
        .finally(() => {
          if (this.isServer) {
            this.loadService.load('', false, false, '', this.window.serverData);
          } else {
            this.loadService.load('', !AppConfig.settings, true);
          }

          switch (true) {
            case isMobile(this.window.navigator).phone:
              this.loadService.attributes.deviceType = 'mob';
              break;
            case isMobile(this.window.navigator).tablet:
              this.loadService.attributes.deviceType = 'tablet';
              break;
            default:
              this.loadService.attributes.deviceType = 'desk';
              break;
          }

          resolve();
        });
    });
  }

  private setWindowServerData(config: any): void {
    this.window.serverData = {
      config,
      data: {
        user: {},
      },
      attrs: {},
    };
  }

  public get config() {
    return AppConfig.settings;
  }

  private fetchConfig(): Promise<any> {
    const envName = environment.name;
    const jsonFilePath = this.getJsonFileByEnv(envName);
    return this.http.get(jsonFilePath).toPromise();
  }

  private fetchUser(): Promise<any> {
    return this.http
      .get(`${AppConfig.settings.lkApiUrl}users/data?_=${Math.random()}`, {
        withCredentials: true,
      })
      .toPromise();
  }

  private getJsonFileByEnv(envName: string): string {
    const host = this.isServer ? this.hostUrl : this.locationService.getOrigin();
    // NOTICE: нужно отличать dev и prod пути до конфига
    const path =
      envName === 'local'
        ? 'assets/config/config.json?_' + Math.random()
        : 'sf-portal/config.json?_' + Math.random();
    return `${host}/${path}`;
  }
}
