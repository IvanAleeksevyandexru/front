import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import {
  ConfigService,
  DatesToolsService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import {
  IGetReferralResponseErrorDetailDto,
  IReferralNumberDto,
} from './referral-number-dto.interface';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';

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
    private config: ConfigService,
    private validationService: ValidationService,
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

  public navigateToNextStep(payload: string): void {
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
