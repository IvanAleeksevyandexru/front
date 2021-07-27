import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import {
  ConfigService,
  DatesToolsService,
  LocationService,
  LoggerService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ReferralNumberService } from './referral-number.service';
import {
  IGetReferralResponseErrorDetailDto,
  IReferralNumberDto,
} from './referral-number-dto.interface';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-referral-number',
  templateUrl: './referral-number.component.html',
  styleUrls: ['./referral-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralNumberComponent implements OnInit {
  public referral: FormControl = new FormControl('');
  public eserviceId: string;
  public sessionId: string;
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public responseError: IGetReferralResponseErrorDetailDto | null = null;
  public data: IReferralNumberDto;

  public data$: Observable<IReferralNumberDto> = this.screenService.component$ as Observable<
    IReferralNumberDto
  >;

  constructor(
    public readonly screenService: ScreenService,
    public readonly currentAnswersService: CurrentAnswersService,
    public readonly navigationService: NavigationService,
    private datesToolsService: DatesToolsService,
    private ngUnsubscribe$: UnsubscribeService,
    private referralNumberService: ReferralNumberService,
    private config: ConfigService,
    private validationService: ValidationService,
    private loggerService: LoggerService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService,
    private locationService: LocationService,
  ) {}

  public ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data: IReferralNumberDto) => {
      this.eserviceId = data?.arguments?.eserviceId;
      this.sessionId = data?.arguments?.sessionId;
      this.data = data;

      this.referral.setValidators([
        Validators.required,
        this.validationService.customValidator((data as unknown) as CustomComponent),
      ]);
    });
  }

  public findReferral(): void {
    this.referralNumberService
      .getReferralSearch(this.referral.value, this.sessionId, this.eserviceId)
      .subscribe(
        () => {
          this.navigateToNextStep(this.referral.value);
        },
        (error) => {
          this.loggerService.error([error?.message]);
          this.openErrorModal();
        },
      );
  }

  private openErrorModal(): void {
    this.modalService
      .openModal(ConfirmationModalComponent, this.referralNumberService.COMMON_ERROR_MODAL_PARAMS)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((reload) => {
        if (reload) {
          this.locationService.reload();
        }
        this.cdr.markForCheck();
      });
  }

  private navigateToNextStep(payload: string): void {
    const navigation = {
      payload: {
        [this.data.id]: {
          value: payload,
          visited: true,
        },
      },
    };
    this.navigationService.next(navigation);
  }
}
