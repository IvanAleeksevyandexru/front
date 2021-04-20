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
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { ConfigService } from '../../../../core/services/config/config.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { invitationType } from './invitation-type';
import LkInvitationInputAttrs from './lk-invitation-input-attrs';
import LkInvitationData from './lk-invitation-data';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-lk-invitation-input',
  templateUrl: './lk-invitation-input.component.html',
  styleUrls: ['./lk-invitation-input.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkInvitationInputComponent implements OnInit {
  @Input() data: ComponentDto;
  @Input() header: string;

  public defaultImgSrc = `${this.config.staticDomainAssetsPath}/assets/icons/svg/warn.svg`;

  public email: FormControl = new FormControl('');

  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public emailSent = false;
  public success = false;
  private requestOptions = { withCredentials: true };

  public constructor(
    public config: ConfigService,
    private http: HttpClient,
    private validationService: ValidationService,
    public readonly navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private loggerService: LoggerService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.email.setValidators([
      Validators.required,
      this.validationService.customValidator((this.data as unknown) as CustomComponent),
    ]); // TODO fix ComponentDto and ComponentBase
  }

  public sendEmail(): void {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1`
      : `${this.config.invitationUrl}`;
    const path = `${urlPrefix}/register/${invitationType.LK_INVITATION}`;

    this.http
      .post(path, this.getInvitationData(), this.requestOptions)
      .pipe(
        finalize(() => {
          this.emailSent = true;
          this.cdr.markForCheck();
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
      );
  }

  private getInvitationData(): LkInvitationData {
    const { gender = null } = this.data.attrs as LkInvitationInputAttrs;

    const data: LkInvitationData = {
      invitedUserEmail: this.email.value,
      additionalParams: { fio: this.getFullName() },
    };

    if (gender) {
      data.additionalParams.gnr = gender;
    }

    return data;
  }

  private getFullName(): string {
    const { fio = null, firstName = null, lastName = null, middleName = null } = this.data.attrs;

    return (fio || `${lastName} ${firstName} ${middleName || ''}`).trim();
  }
}
