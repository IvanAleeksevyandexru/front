import { Component } from '@angular/core';
import { UserSession } from '../../projects/epgu-constructor/src/app/services/user-session/user-session.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userSession: UserSession = {
    userId: '1000298933',
    // eslint-disable-next-line max-len
    token:
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTk0NjM5NTQsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9zZWM_bW9kZT13Jm9pZD0xMDAwMjk4OTMzIGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfdHJtP29pZD0xMDAwMjk4OTMzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX2luZj9vaWQ9MTAwMDI5ODkzMyZtb2RlPXciLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjdkYWE4ODU3MGI3MWZmNDcxNjNiYzkwMWIyMzkwMGM1ZmI1MjIzMzU3YTg5ZGNkNGI0M2EwYjhjYTRmN2FhYTEiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTg5MzMsImV4cCI6MTU5OTU1MDM1NCwiaWF0IjoxNTk5NDYzOTU0LCJjbGllbnRfaWQiOiJQR1UifQ.DYNRCRT5byN99N7miEUfsDlu1Iezq43nXpQGad6nYlSoUJ9hPajhvONN74DPYFMRXxE2Ic7dHAwMIJrN30fSMNl-KpVFQ3S5XVRWp5YP9AcWmwDHe1wGe6IzMwaZ1FtVMBp482AaJXO7DhPmGl0ytNyFRNlNi9_ZxcIK4iYpsF-qUNQWNfA81hWMRazKOykketa8gVpQIeKK38jjOTkNGdAoI7WI7Hftzr4izSMk44SKYN91TGsfRKyR-5saPUMHSSVVbfi4LwLHCwWeD5nfE29-i76P4qfZhySRNycTM8M0rv9A98NAgyKLWWyg6S5RU6xY8q_BqXUvYKIQRJ_oEg',
  };
}
