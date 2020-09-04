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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkyMTUxMjIsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjA4ZGJiMWQ5MmFlZGIxYmFjYzY4ZDE4OGZhNmUyOWYwMDU2YmM4ZTJjMGUwZjgzMGEzMjlhZjk3YzBmOWMyMTUiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTMwMTUyMiwiaWF0IjoxNTk5MjE1MTIyLCJjbGllbnRfaWQiOiJQR1UifQ.fJtN8nhaCUfPkSZSjJTjszcoLCu7KxLnJ1oxmu10P_F157Fp1syJjiXZ3C5J6J4xy9f6-y3keMDShG60KHUqKKO3YwbCyBKczyAnq2xXidWYuyqPp_bctRVDNoIJ08H8iXNmU02ryryvQ-siFp1fhNPiNtjso2ex1CfUJ-sblTkR-AK9SsiWTIEU34sQ9vrSltsovcZyOo9wZV703M4p3ARbrMNoQuXF-glyh2TQSlOZ2cerBQU_NGFFO5Hv4BBThsTZG6eb5o2X9r8UbvP4JfuRrSWtIwNIKB16CszTrn47zMihnZD0HEayja5v_PN9HsE9ZaEV_4PkPOPrqx6-Vw',
  };
}
