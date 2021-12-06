import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadService } from '@epgu/ui/services/load';
import { WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { isPlatformServer } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loadService: LoadService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformServer(this.platformId)) {
      return false;
    }

    if (this.loadService.user.authorized) {
      return true;
    }

    this.window.location.href = this.loadService.config.authProviderLoginUrl + this.window.btoa(this.window.location.href);
    return false;
  }
}
