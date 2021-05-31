import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import {
  ConfigService,
  DATE_STRING_DASH_FORMAT,
  DatesToolsService,
  LoggerService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ReferralNumberService } from './referral-number.service';
import {
  IGetReferralResponseErrorDetailDto,
  IGetReferralResponseItemAttributeDto,
  IReferralNumberDto,
} from './referral-number-dto.interface';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';

export enum SearchReferralStatus {
  WAIT_FOR_USER_INPUT = 'WAIT_FOR_USER_INPUT',
  ERROR_RESPONSE = 'ERROR_RESPONSE',
}

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
  public searchStatus: SearchReferralStatus = SearchReferralStatus.WAIT_FOR_USER_INPUT;
  public SearchReferralStatus = SearchReferralStatus;
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public defaultErrorImgSrc = `${this.config.staticDomainAssetsPath}/assets/icons/svg/warn.svg`;
  public defaultErrorLabel = 'Внимание!';
  public defaultErrorText = 'Произошла ошибка, пожалуйста повторите попытку';
  public responseError: IGetReferralResponseErrorDetailDto | null = null;
  public data: IReferralNumberDto;

  public data$: Observable<IReferralNumberDto> = this.screenService.component$ as Observable<
    IReferralNumberDto
  >;

  private EXPIRED_ERROR_DETAIL: IGetReferralResponseErrorDetailDto = {
    errorCode: -1,
    errorMessage: 'Повторное направление можно получить у того же специалиста',
  };

  private NETWORK_ERROR_DETAIL: IGetReferralResponseErrorDetailDto = {
    errorCode: -2,
    errorMessage: 'Ошибка загрузки данных',
  };

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
        (response) => {
          if (response?.error?.errorDetail?.errorCode !== 0) {
            this.setErrorState(response?.error?.errorDetail);
          } else if (this.isReferralExpired(response?.items[0]?.attributes)) {
            this.setErrorState(this.EXPIRED_ERROR_DETAIL);
          } else {
            this.navigateToNextStep(response);
          }
        },
        (error) => {
          this.loggerService.error([error?.message]);
          this.setErrorState(this.NETWORK_ERROR_DETAIL);
        },
      );
  }

  public hasErrorStatus(): boolean {
    return this.searchStatus !== SearchReferralStatus.WAIT_FOR_USER_INPUT;
  }

  public goBack(): void {
    this.searchStatus = SearchReferralStatus.WAIT_FOR_USER_INPUT;
  }

  public chooseDoctor(): void {
    this.navigateToNextStep(this.responseError);
  }

  private isReferralExpired(attributes: IGetReferralResponseItemAttributeDto[]): boolean {
    const referralEndDate = attributes?.find(({ name }) => name === 'referralEndDate');

    return (
      referralEndDate &&
      this.datesToolsService.isBefore(
        this.datesToolsService.parse(referralEndDate.value, DATE_STRING_DASH_FORMAT),
        Date.now(),
      )
    );
  }

  private setErrorState(errorDetail: IGetReferralResponseErrorDetailDto): void {
    this.searchStatus = SearchReferralStatus.ERROR_RESPONSE;
    this.responseError = errorDetail;
  }

  private navigateToNextStep(payload: object): void {
    const navigation = {
      payload: {
        [this.data.id]: {
          value: JSON.stringify(payload),
          visited: true,
        },
      },
    };
    this.navigationService.next(navigation);
  }
}
