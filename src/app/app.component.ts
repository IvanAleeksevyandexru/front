import { Component } from '@angular/core';
import { UserSession } from '../../projects/epgu-constructor/src/app/services/user-session/user-session.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userSession: UserSession = {
    userId: '1000305301',
    // eslint-disable-next-line max-len
    token:
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTk0NjM2NzEsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImVkZjk1MjMxOWY5ZjAzYThkNTQ1MWYzOTM0M2QyYmJiNjliYWM0M2M5MDBlYmY2YTI1YzA5ZTUzYjM5MDhjYWUiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTU1MDA3MSwiaWF0IjoxNTk5NDYzNjcxLCJjbGllbnRfaWQiOiJQR1UifQ.jkTSv-OZ9dEEqSThmBlNmua4eKdEo1AXrcHU0MKdl5vJFdl5Z0IDwH_FeeG8lzNiejlQ_-783hdArRWbyo3BLzXv5t7_tnon-rYrWIn3uHkLczY4GB03Wb5NYBKTkU2JGRP72iQpgXw6HfKDAZ5qfbTZceVlH2dgoSUPHnfCmiio9yYp8AWwA5eGNmEYQzd600bQWQoFRyXt5w3urNEpybuxR5z_2IQrI1_cYdeEr0_r9dnRP53J5SSB6JKLqXX54arI-5e6hhpiCLryXFmuDJhFB-tVCfwtY8lfD31LEPq40otVcAAQ-B-z574VI8EAR1lVvoTT_YsCluBNEnMyvg',
  };
}
