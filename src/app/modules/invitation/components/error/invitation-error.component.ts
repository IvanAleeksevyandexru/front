import { Component, Input, OnInit } from '@angular/core';

interface IAttrsError {
  msg: string;
  url: string;
}
@Component({
  selector: 'app-invitation-error',
  templateUrl: './invitation-error.component.html',
  styleUrls: ['./invitation-error.component.scss'],
})
export class InvitationErrorComponent implements OnInit {
  readyToRegistration: boolean;

  @Input() attrs: IAttrsError;

  ngOnInit(): void {}
}
