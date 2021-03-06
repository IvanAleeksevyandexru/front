/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, PLATFORM_ID, Optional, Inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LoadService } from '@epgu/ui/services/load';
import { CookieService } from 'ngx-cookie';
import isMobile from 'ismobilejs';
import { LocationService, LoggerService, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { isPlatformServer } from '@angular/common';
import { HOST_URL } from './tokens/host-url.token';
import { IframePlayerService } from './services/iframe-player/iframe-player.service';
import { filter, map, take } from 'rxjs/operators';

const packageJson = require('../../package.json');

@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  public static settings: any;

  private isServer = isPlatformServer(this.platformId);

  constructor(
    private http: HttpClient,
    private loadService: LoadService,
    private loggerService: LoggerService,
    private cookieService: CookieService,
    private locationService: LocationService,
    private iframeService: IframePlayerService,
    @Inject(WINDOW) private window: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(HOST_URL) private hostUrl: string,
  ) {}

  public load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fetchConfig()
        .then((response: any) => {
          if (this.iframeService.hasIframe) {
            this.iframeService.initIframeEmbedding();
            return this.iframeService.hasAcceptedData$
              .pipe(
                filter((status) => !!status),
                map(() => response),
                take(1),
              )
              .toPromise();
          } else {
            return response;
          }
        })
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
        .catch((err) => {
          console.error('Error occured, while fetching config resources', err);
          reject();
        })
        .finally(() => {
          if (this.isServer) {
            this.loadService.load('', false, false, '');
          } else {
            const packageVersion = isDevMode() ? '' : packageJson.dependencies['@epgu/ui'];
            this.loadService.load('', false, true, packageVersion);
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
    // NOTICE: ?????????? ???????????????? dev ?? prod ???????? ???? ??????????????
    const path =
      envName === 'local'
        ? 'assets/config/config.json?_' + Math.random()
        : 'sf-portal/config.json?_' + Math.random();
    return `${host}/${path}`;
  }
}
