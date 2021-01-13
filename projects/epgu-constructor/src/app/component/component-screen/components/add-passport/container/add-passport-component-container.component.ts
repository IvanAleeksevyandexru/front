import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../screen/screen.types';
import { Passport } from '../add-passport.models';

@Component({
  selector: 'epgu-constructor-add-passport-container',
  templateUrl: './add-passport-component-container.component.html',
  styleUrls: ['./add-passport-component-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportContainerComponent {
  data$: Observable<ComponentBase> = this.screenService.component$;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private screenService: ScreenService,
  ) {}

  onPassportDataChange({ value, isValid }: Passport): void {
    this.currentAnswersService.isValid = isValid;
    this.currentAnswersService.state = JSON.stringify(value);
  }
}
