import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { ComponentActionDto } from '@epgu/epgu-constructor-types';
import { map } from 'rxjs/operators';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../screen/screen.types';
import { Passport } from '../add-passport.models';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';

@Component({
  selector: 'epgu-constructor-add-passport-container',
  templateUrl: './add-passport-component-container.component.html',
  styleUrls: ['./add-passport-component-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportContainerComponent {
  data$: Observable<ComponentBase> = this.screenService.component$;
  cachedValue$: Observable<string> = combineLatest([this.screenService.display$]).pipe(
    map(([data]) => {
      return JSON.parse(
        data.components.find(
          (component) => component.type === UniqueScreenComponentTypes.passportLookup,
        ).value || '{}',
      );
    }),
  );

  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentAnswersService.isValid = false;
  }

  onPassportDataChange({ value, isValid }: Passport): void {
    if (!value?.rfPasportSeries || !value?.rfPasportNumber) {
      this.currentAnswersService.isValid = false;
      return;
    }

    this.currentAnswersService.isValid = isValid;
    this.currentAnswersService.state = JSON.stringify(value);
    this.cdr.detectChanges();
  }
}
