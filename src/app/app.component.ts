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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTkyMTYxNzAsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjY1NTU5MGNhNzUxMDAzYjFhM2Y2ZWQyOGY1ZWMzNzAwMDc4ZmFjOWJmMmI0N2Q5YWVhNmRmZjNjOTc4NGY2YWMiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTMwMjU3MCwiaWF0IjoxNTk5MjE2MTcwLCJjbGllbnRfaWQiOiJQR1UifQ.Z6lmDqCZv_jFydd8PzaanGrb6fjqr2yBCE-hww0zCLcNX8kdYawJE5uuKx1k4qLMMwPqB1ntqEV3RARzKH4ICBuwJMwzvKJsog_k8EcDbp7MJ3M0AttZhzfATGBeMof2lHYPCf4nclLMCEdHFgbVbtD8sunlwoPekfA3Bo1oifNbDfYIOflGht0IOqheBXXeogt44N3pdFq31OxLY4dYmKzrCA1UnBDZfKfgds2nSnprchRKyUMRM1UEsEtlpJydHykCEGxj7lD6I08dX_umzOovoNp6IyVbZj9EJpswh3gjAWbIfIziuW1kAi53mRgtsCa_5GQvYt3RMyGQVGpfPg',
  };
}
