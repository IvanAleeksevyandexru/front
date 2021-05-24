import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ComponentActionDto } from 'epgu-constructor-types';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenStoreComponentDtoI } from '../../../../../screen/screen.types';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { CachedValue } from '../select-children.models';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-select-children-screen-container',
  templateUrl: './select-children-screen-container.component.html',
  styleUrls: ['./select-children-screen-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenScreenContainerComponent implements AfterViewInit {
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    map((label) => label || 'Добавить ребёнка'),
  );
  cachedValue$: Observable<CachedValue> = this.screenService.component$.pipe(
    map((data) => {
      const cachedValue = this.screenService.getCompValueFromCachedAnswers(data.id);

      return cachedValue
        ? this.cachedAnswersService.parseCachedValue<CachedValue>(cachedValue, data)
        : null;
    }),
  );
  component$: Observable<ScreenStoreComponentDtoI> = this.screenService.component$.pipe(
    map((component) => this.screenService.getCompFromDisplay(component.id)),
  );
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public updateCurrentAnswersState(state: { [key: string]: string | number | boolean }[]): void {
    this.currentAnswersService.state = state;
  }

  public updateCurrentAnswersValid(isValid: boolean): void {
    this.currentAnswersService.isValid = isValid;
  }
}
