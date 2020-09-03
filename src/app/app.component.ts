import { Component } from '@angular/core';
import { UserSession } from '../../projects/epgu-constructor/src/app/services/user-session/user-session.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userSession: UserSession = {
    userId: '1000299353',
    // eslint-disable-next-line max-len
    token:
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkxMjg2MzksInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjBkOGJiNWFiNzY2ZjAwOWU4NzJiMzg3NDM3ZTAxOGEyNjdjZGRiNmQ5MjNjNWZlYWFlMGU2ZWQyN2UxNjBhOWIiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTIxNTAzOSwiaWF0IjoxNTk5MTI4NjM5LCJjbGllbnRfaWQiOiJQR1UifQ.t6Rjd1yV0Imi7hCzGU37femlwRZDJncNHAOxg1Ku9pvpbdsffmnQYkDue2kQZoEJKEiMFnK3ZGUIZ59ZPQxdqN4Pg5-nnFNvn102s-Pol-PSKupQ0A8DTvRbSqWaOzmC_IOANN70dIajVHbCKqbVFWYL5T5yx18VowdBddZEFyhrgnIeyNwaG-Wyvq407gMa0TnRHm9zpo7cvWmRzMT13upQ0Sz4lrQw57pcEyCQzhj7EWtHEqL6TEpFuH_ohwJ_xb5iWYmcHQn4OwlB3qB8MbycKKSXR-gXe0bz_aK8B-AZp9epfJ05Sj5_8ACYPtYGCx7WwqNczevNiDkqDfHyZg',
  };
}
