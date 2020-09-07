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
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTk0MjY1NjksInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9zZWM_bW9kZT13Jm9pZD0xMDAwMzA1MzAxIGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfdHJtP29pZD0xMDAwMzA1MzAxJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX2luZj9vaWQ9MTAwMDMwNTMwMSZtb2RlPXciLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImYwN2QyMzJlNzU2MDE2Yzk5ZGVhM2IwYjJjZDA0OWQxODlhYTFhNzBhOTc2YjE3N2MyMDg4MDQ4MmI1YTdjNjIiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAzMDUzMDEsImV4cCI6MTU5OTUxMjk2OSwiaWF0IjoxNTk5NDI2NTY5LCJjbGllbnRfaWQiOiJQR1UifQ.fIb1AcFF38lZrNpMFT-KJHlu9O2UzyXnxUsh8knxC3T43EccPqAK2m56K9WvdWU-qXvTO5OvwySv12CgV002dxg8v0UE2btxTyjxEa9GQsJl2J2UmjkYSd5OUvOqf15caCf0SHYqlR5KXbOHRmtE_xtFK8SYTY-Y98n46USuNqJmpV9pkcIMVjOdlWQfx1kjS3RIYORZd7nSxXLikpTbggoisbyXJW2jsh9Ib1I9Ph5zNEYj0JEgIppdkQg0xqGMGxO372c6C_otf7BOhll4zYrhaZvXX3fic7fzJt7w3XJ0OuJQ-6Iw2o25ivzAuONkeokb97fAEiSAvScAeFfZwA',
  };
}
