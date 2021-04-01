import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { finalize, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../core/services/config/config.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import {
  ApplicantAnswersDto,
  ComponentDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';

@Component({
  selector: 'epgu-constructor-invitation-error',
  templateUrl: './invitation-error.component.html',
  styleUrls: ['./invitation-error.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationErrorComponent implements OnInit {
  @Input() data: ComponentDto;
  @Input() applicantAnswers: ApplicantAnswersDto;
  @Input() orderId: number;
  @Input() header: string;

  public defaultImgSrc = `${this.config.staticDomainAssetsPath}/assets/icons/svg/warn.svg`;

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
    private locationService: LocationService,
    private ngUnsubscribe$: UnsubscribeService,
    private loggerService: LoggerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.email.setValidators(
      this.validationService.customValidator((this.data as unknown) as CustomComponent),
    ); // TODO fix ComponentDto and ComponentBase
  }

  sendEmail(): void {
    const ref = this.data.attrs?.ref as string; // TODO: выяснить почему ref может быть массивом либо строкой
    const value = this.applicantAnswers[ref]?.value;
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
    const path = `${urlPrefix}/orders/${this.orderId}/invitations/inviteToSign/send`;
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
          this.loggerService.error(error);
        },
        () => {
          this.cdr.markForCheck();
        },
      );
  }
  redirectToLK(): void {
    this.locationService.href(this.config.lkUrl);
  }
}
