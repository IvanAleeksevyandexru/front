import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { finalize, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../core/config/config.service';
import { ValidationService } from '../../../components-list/services/validation.service';
import { ScenarioDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-invitation-error',
  templateUrl: './invitation-error.component.html',
  styleUrls: ['./invitation-error.component.scss'],
  providers: [UnsubscribeService],
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
  public imgErrorSrc = '';
  private requestOptions = { withCredentials: true };

  constructor(
    public config: ConfigService,
    private http: HttpClient,
    private validationService: ValidationService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.imgErrorSrc =
      this.data.attrs.src || `${this.config.staticDomainAssetsPath}/assets/img/server-error.svg`;
    this.email.setValidators(this.validationService.customValidator(this.data));
  }

  sendEmail(): void {
    const ref: any = this.data.attrs?.ref;
    const value = this.scenarioDto.applicantAnswers[ref]?.value;
    if (!value) {
      this.emailSent = true;
      return;
    }
    const { snils } = JSON.parse(value);
    const userData = [
      {
        type: 'SNILS',
        id: snils,
        email: this.email.value,
      },
    ];
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1`
      : `${this.config.invitationUrl}`;
    const path = `${urlPrefix}/orders/${this.scenarioDto.orderId}/invitations/inviteToSign/send`;
    this.http
      .post(path, userData, this.requestOptions)
      .pipe(
        finalize(() => {
          this.emailSent = true;
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(
        () => {
          this.success = true;
        },
        (error) => {
          console.error(error);
        },
      );
  }
  redirectToLK() {
    window.location.href = this.config.lkUrl;
  }
}
