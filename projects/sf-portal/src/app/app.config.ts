import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { LoadService } from '@epgu/ui/services/load';
import { Observable, of } from 'rxjs';
import { CookieService } from '@epgu/ui/services/cookie';
import isMobile from 'ismobilejs';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  public static settings: any;

  constructor(
    private http: HttpClient,
    private loadService: LoadService,
    private cookieService: CookieService
  ) {
  }

  public load() {
    return new Promise<void>((resolve) => {
      this.loadConfig().pipe(
        mergeMap((response: any) => {
          AppConfig.settings = response;
          (window as any).serverData = {
            config: AppConfig.settings,
            data: {
              user: {}
            },
            attrs: {}
          };
          if (this.cookieService.get('acc_t')) {
            return this.loadUser();
          } else {
            return of();
          }
        })
      ).toPromise().then((response: any) => {
        (window as any).serverData.data.user = response || {};
      }).finally(() => {
        this.loadService.load('', !AppConfig.settings, true).then();
        switch (true) {
          case isMobile(window.navigator).phone: {
            this.loadService.attributes.deviceType = 'mob';
            break;
          }
          case isMobile(window.navigator).tablet: {
            this.loadService.attributes.deviceType = 'tablet';
            break;
          }
          default: {
            this.loadService.attributes.deviceType = 'desk';
            break;
          }
        }
        resolve();
      });
    });
  }

  public get config() {
    return AppConfig.settings;
  }

  public loadConfig(): Observable<any> {
    const envName = environment.name;
    const jsonFile = envName === 'local' ? 'assets/config/config.json?_' + Math.random() : 'sf-portal/config.json?_' + Math.random();
    return this.http.get(jsonFile);
  }

  public loadUser(): Observable<any> {
    return this.http.get(`${AppConfig.settings.lkApiUrl}users/data?_=${Math.random()}`, {
      withCredentials: true
    });
  }
}
