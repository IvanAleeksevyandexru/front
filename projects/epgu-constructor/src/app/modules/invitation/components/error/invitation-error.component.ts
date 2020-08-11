import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormControl } from '@angular/forms';

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
  email: FormControl = new FormControl('');

  @Input() attrs: IAttrsError;
  @Output() getEmail: EventEmitter<string> = new EventEmitter<string>();

  sendEmail(): void {
    this.getEmail.emit(this.email.value);
  }

  ngOnInit(): void {}
}
