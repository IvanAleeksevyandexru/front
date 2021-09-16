import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CachedAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { EquipmentChoiceUpdateEvent, EquipmentChoiceSaveValue } from '../equipment-choice.types';

@Component({
  selector: 'epgu-constructor-equipment-choice-container',
  templateUrl: './equipment-choice-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentChoiceContainerComponent {
  cachedValue$: Observable<string> = combineLatest([
    this.screenService.component$,
    this.screenService.cachedAnswers$,
  ]).pipe(
    takeUntil(this.ngUnsubscribe$),
    map(([component, cachedAnswers]) => this.getCachedValue(cachedAnswers, component)),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  public onEquipmentChoiceChange({ value, isValid }: EquipmentChoiceUpdateEvent): void {
    this.currentAnswersService.isValid = isValid;
    this.cdr.detectChanges();

    if (isValid) {
      this.currentAnswersService.state = JSON.stringify(new EquipmentChoiceSaveValue(value));
    }
  }

  private getCachedValue(cachedAnswers: CachedAnswersDto, component: ComponentDto): string {
    return this.cachedAnswersService.getCachedValueById(cachedAnswers, component.id);
  }
}
