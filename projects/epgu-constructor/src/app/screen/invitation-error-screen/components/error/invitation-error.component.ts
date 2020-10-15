import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { takeUntil, tap } from 'rxjs/operators';
import { ConfigService } from '../../../../config/config.service';
import { ValidationService } from '../../../custom-screen/services/validation.service';
import { ScenarioDto } from '../../../../services/api/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-invitation-error',
  templateUrl: './invitation-error.component.html',
  styleUrls: ['./invitation-error.component.scss'],
})
export class InvitationErrorComponent implements OnInit {
  @Input() data: any;
  @Input() scenarioDto: ScenarioDto;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();
  public email: FormControl = new FormControl('', {
    validators: Validators.required,
  });

  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public emailSent = false;
  public success = false;
  private requestOptions = { withCredentials: true };

  constructor(
    public config: ConfigService,
    private http: HttpClient,
    private validationService: ValidationService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.email.setValidators(this.validationService.customValidator(this.data));
  }

  sendEmail(): void {
    const value = this.scenarioDto.applicantAnswers.sn1a?.value;
    if (!value) {
      this.emailSent = true;
      return;
    }
    const snils = JSON.parse(value).inputSnils;
    const userData = [
      {
        type: 'SNILS',
        id: snils,
        email: this.email.value,
      },
    ];

    const path = `${this.config.invitationUrl}/orders/${this.scenarioDto.orderId}/invitations/inviteToSign/send`;
    this.http
      .post(path, userData, this.requestOptions)
      .pipe(
        tap(() => {
          this.emailSent = true;
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(
        () => {
          this.success = true;
        },
        (error) => console.error(error),
      );
  }
  redirectToLK() {
    window.location.href = this.config.lkUrl;
  }
}
