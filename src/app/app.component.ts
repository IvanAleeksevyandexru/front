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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkxMjk1NzksInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImNlMDZlYzNiMzRhN2UxMzFiMTU5MTQ3YjVhMWZjNzRiNmRiNDEyNDI2ZGFiZDY2ZWRkZmQwZTRlYTU2MzRkNDUiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTIxNTk3OSwiaWF0IjoxNTk5MTI5NTc5LCJjbGllbnRfaWQiOiJQR1UifQ.voTnMdxr98cZsBXA3YKprJINbUjIgDxa0OD1W6b3UMeWX5Ff-geqCs38PFVS_HGOsd48KP9rZ3Htt-F7kc-I6b99JUm_KXWxuhNQ65hOrDOIYncTOYPA0lMzx9exNq6aZ_fynCydg56wbdt2VflzcbZJp0fQEiV_f3125UtaY6-3kDOMSsYoPPF7dQfSmM_WAwYnzmyn7bp73qoKDhHto6Hxi7TOegHEeXF7kunOYl1KkH6pD-4tME62j2Hie5YgVvZbNPLdkuribA57FHSP_OCIRUroin44QnfjilE9joVxAh-SyatU8IP7yhNVXQdojmCKr83Wxh5OM6M4Jkd4iQ',
  };
}
