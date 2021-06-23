import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ComponentActionDto, ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import { EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenStoreComponentDtoI } from '../../../../../screen/screen.types';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { CachedValue } from '../select-children.models';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { UniquenessErrorsService } from '../../../../../shared/services/uniqueness-errors/uniqueness-errors.service';

@Component({
  selector: 'epgu-constructor-select-children-screen-container',
  templateUrl: './select-children-screen-container.component.html',
  styleUrls: ['./select-children-screen-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenScreenContainerComponent implements OnInit, AfterViewInit {
  componentId: string;
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((label) => label || 'Добавить ребёнка'),
  );
  cachedValue$: Observable<CachedValue> = this.screenService.component$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((data) => {
      const cachedValue = this.screenService.getCompValueFromCachedAnswers(data.id);

      return cachedValue
        ? this.cachedAnswersService.parseCachedValue<CachedValue>(cachedValue, data)
        : null;
    }),
  );
  component$: Observable<ScreenStoreComponentDtoI> = this.screenService.component$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((component) => {
      this.componentId = component.id;
      return this.screenService.getCompFromDisplay(component.id);
    }),
  );
  componentErrors$: Observable<ScenarioErrorsDto[]> = this.screenService.componentErrors$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((componentErrors): ScenarioErrorsDto[] => {
      return this.uniquenessErrorsService.preparedUniquenessErrors || [componentErrors];
    }),
  );
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
    private cdr: ChangeDetectorRef,
    private ngUnsubscribe$: UnsubscribeService,
    private uniquenessErrorsService: UniquenessErrorsService,
    private eventBusService: EventBusService,
  ) {}

  ngOnInit(): void {
    this.eventBusService
      .on('updateCurrentAnswerServiceStateEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(({ state, index }) => {
        this.updateCurrentAnswersState(state, index);
      });
  }

  ngAfterViewInit(): void {
    this.uniquenessErrorsService.init();
    this.cdr.detectChanges();
  }

  public updateCurrentAnswersState(state: Record<string, string>[], index: number): void {
    this.uniquenessErrorsService.calculatePreparedUniqErrors(state, index);
    this.currentAnswersService.state = state;
  }

  public updateCurrentAnswersValid(isValid: boolean): void {
    this.currentAnswersService.isValid = isValid;
  }
}
