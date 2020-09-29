import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormControl } from '@angular/forms';
import { ConfigService } from '../../../../config/config.service';

@Component({
  selector: 'epgu-constructor-invitation-error',
  templateUrl: './invitation-error.component.html',
  styleUrls: ['./invitation-error.component.scss'],
})
export class InvitationErrorComponent implements OnInit {
  readyToRegistration: boolean;
  email: FormControl = new FormControl('');

  @Input() data: any;
  @Output() getEmail: EventEmitter<string> = new EventEmitter<string>();

  constructor(public config: ConfigService) {}

  sendEmail(): void {
    this.getEmail.emit(this.email.value);
    // TODO: добавить бизнес-логику отправки email на ручку /sendInvitation
    window.location.reload();
  }

  ngOnInit(): void {}
}
