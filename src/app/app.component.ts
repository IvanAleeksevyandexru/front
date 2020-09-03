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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkxMzM4MDUsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6Ijc3NWJiOGFkYzJlODVkNWVmMTNiMDUyYjYxOWVjODg1NzczYjZmNmFlNTVmZmM2MGUwMzg4YmUwYWIwNWY5YzkiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTIyMDIwNSwiaWF0IjoxNTk5MTMzODA1LCJjbGllbnRfaWQiOiJQR1UifQ.ja0RDZrZx2YDIYd7AkZGO1MksdReQLhuM-EGVmnmBSQR9pON604EKErsXoBl3JGmUmOrfWRh-YYPm9ettu31Gw69hYXbznDorjnKMvac43CMiODLPAk6DkEOQrhS4hScnPBW4M44twBcgSKaxCCwP3d5JAv-3bd2yvfO71mr_-7cu0nHLXBPGq7qC9Gu_OGcxOlcetgVD7XEPcN9NaM29lFUJlVxZEOF9p3Ji5i7wzzonQqczyuh6Qbnvtov5gyJmUKryWAcJ80OHHVqnJQ7WmMwUJgGOpdtL78Jniwl9PTNNu-7XBBahwT-3w3OAt4DEmIAMdfI1UkQWeipA7DPmw',
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
