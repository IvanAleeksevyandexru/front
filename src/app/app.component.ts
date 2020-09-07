import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserSession } from '../../projects/epgu-constructor/src/app/services/user-session/user-session.type';
import { MockCurrentUserId, MockCurrentUserToken } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userSession: UserSession = {
    userId: MockCurrentUserId,
    // eslint-disable-next-line max-len
    token: MockCurrentUserToken,
  };
  serviceId = 'local';

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.initSessionCookies();
  }

  initSessionCookies(): void {
    this.cookieService.set('u', this.userSession.userId);
    this.cookieService.set('acc_t', this.userSession.token);
  }
}
