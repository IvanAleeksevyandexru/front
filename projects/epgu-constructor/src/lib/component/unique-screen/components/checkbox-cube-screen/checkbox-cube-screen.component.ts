import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckboxChange, ComponentDto } from '@epgu/epgu-constructor-types';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-checkbox-cube-screen',
  templateUrl: './checkbox-cube-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxCubeScreenComponent {
  public nextStepAction = NEXT_STEP_ACTION;
  public component$: Observable<ComponentDto> = this.screenService.component$;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
  ) {}

  public handleCheckboxChange($event: CheckboxChange): void {
    this.setState($event);
  }

  private setState($event: CheckboxChange): void {
    const { changes, isValid } = $event;

    this.currentAnswersService.state = changes;
    this.currentAnswersService.isValid = isValid;
    this.cdr.detectChanges();
  }
}
