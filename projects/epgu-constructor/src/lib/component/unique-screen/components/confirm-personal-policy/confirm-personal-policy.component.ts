import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import {
  UnsubscribeService,
  ConfigService,
  JsonHelperService,
  BaseComponent,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { PersonalPolicyWithErrors } from './confirm-personal-policy.types';
import { ComponentFieldDto } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-confirm-personal-policy',
  templateUrl: './confirm-personal-policy.component.html',
  styleUrls: ['./confirm-personal-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalPolicyComponent extends BaseComponent implements OnInit {
  public data$ = this.screenService.component$.pipe(
    map<PersonalPolicyWithErrors, PersonalPolicyWithErrors>((data) => ({
      ...data,
      value: data.value,
      errors: data?.errors || [],
    })),
  );
  public errors = [];
  public fields: ComponentFieldDto[];

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private jsonHelperService: JsonHelperService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      if (!data.value) {
        this.errors = data.errors;
        this.currentAnswersService.isValid = false;
        return;
      }

      this.currentAnswersService.state = data.value;
      const value = this.jsonHelperService.tryToParse(
        data.value,
      ) as PersonalPolicyWithErrors['value'];

      this.errors = data.errors?.length ? data.errors : value.errors;
      this.fields = data.attrs?.fields;
      this.fields.forEach((field) => {
        field.value = value.storedValues[field.fieldName];
      });

      this.currentAnswersService.isValid = !this.errors.length;
    });
  }
}
