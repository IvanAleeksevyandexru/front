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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTk0NjYwMDcsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjQ3MWRhMWZmMDFmZmViZjBmNGQxMzVkMjg4MDY4ODNlMTM2NzY5NGQ1MWM2NDNjOTBhNWZhOWJlNTA1NTU3YzciLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTU1MjQwNywiaWF0IjoxNTk5NDY2MDA3LCJjbGllbnRfaWQiOiJQR1UifQ.S0qDiSTsWeh9T-T9yL7W1kgbTCtkNEvMVZw8UyO1i2jaOghaCiXYUtk7lQXoJWFi6f4z4gv-6cYto22zF5tiTEmOPTX3EBP2lULZ7CMpKK5Qoe-NPJXaIiR6Ixu3lc5x1a26525cf54a2iTuZspxSGih2LAz-2pRoX72VEuhhZHd1pMqQjx9Qqho47i-5eiWqj8bZq7oxSU0N16eBQKvUmqCF83yzvklwc-guwcDOnH72q-QH7ibHL3yEBX5K-FA_FokA7C7mVusHAvpBuULUnxPJ69WY-ZtKB6EKYF2IaefOs4qAismey5SMEhTfiDYDmtnLWNc-37XX_TmccSTWg',
  };
}
