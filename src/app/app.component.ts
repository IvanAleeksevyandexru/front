import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserSession } from '../../projects/epgu-constructor/src/app/services/user-session/user-session.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userSession: UserSession = {
    userId: '1000299353',
    // eslint-disable-next-line max-len
    token:
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkyMjI5MzIsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImFmZTU3Y2RjYzAzNWZhMmM3ZTJhZTYxN2UxY2IyYmRmYzY1MGQxMjk0ZjU3YWQ0MGM1MjJmZTRmMmNhNGY0NWYiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTMwOTMzMiwiaWF0IjoxNTk5MjIyOTMyLCJjbGllbnRfaWQiOiJQR1UifQ.bDK0_1ao8USlcs8ukIdT4Cr78GKYWfN1fvXOipJBgQGKmIWti6JYV2t71WNmlwTeA6ywbqbBwUulmBl26zLeMfDfWryG-aAS2bp-QLBphwizUgaP-kV4rB3UGQ0s6mHq9WLmFdCHqA-dbj-sxIP2nrSZDIcIkDFF4N_fH6ICxanpDwBlWSvZgtWSFN8KEbRhFjM7xvY8Oa0tCyUlmzS1Jbj-dmM1FTGdpJf3rPBHTdaUFpqc21e9omZ89bY2ovbP4UuhYRCQmYguqbehi2M8-qh82s2-U1-LPKdYUiiA2lGWUIL_06A6vOageMW0b4z4_ZPsnIJ_OU8tHzmk3QZSJg',
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
