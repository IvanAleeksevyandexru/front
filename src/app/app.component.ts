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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkzOTQ3MTgsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImM5YjI1MTVjN2M2OTMyOTA0M2QxMmViZmMxNzA1ZWIyM2YwYTM0NzQ3ZDZlYjBiYTJjZmRiNDFhNDc5MjUzYzQiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTQ4MTExOCwiaWF0IjoxNTk5Mzk0NzE4LCJjbGllbnRfaWQiOiJQR1UifQ.F7W5JXLxZnWZhr0rGidqAYl-o9CWkVDogingWUZt1b-NFOCh-okSIyFeEnqAsmZtcfx6HFYj_UwZROCGGtggGQHYqr-vKLEO31iOa2X1JJkXeu_qCopb67HzMxeWnNJERiwhaF6Cx6hCPUkU8SydqYiy1lznIaM0t8m36t4bghTXFs9pexYZnUvmmTWQnaggBq9SYCPnZs7w8Cg5kuqMar5RRW2kf-2s05uS70ywjFd8v1Y27LZu2qd2WcT4ACzAzaObEw8fvoIhmxaIQvNbK6vwAusrwl_xeS3bCOyNfcgWrKQzsZrJJ8XgzP9HMN8Qir78h0QMRKodFqgFr0cP6w',
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
