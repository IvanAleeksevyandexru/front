import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadService } from '@epgu/ui/services/load';
import { AuthService } from '@epgu/ui/services/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loadService: LoadService,
    private authService: AuthService
  ) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loadService.user.authorized) {
      return true;
    }
    window.location.href = this.loadService.config.authProviderLoginUrl + btoa(window.location.href);

    return false;
  }
}
