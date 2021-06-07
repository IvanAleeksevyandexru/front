import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, pairwise, takeUntil, tap } from 'rxjs/operators';
import { DisplayDto, ScenarioErrorsDto, ScreenTypes } from '@epgu/epgu-constructor-types';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { isEqualObj } from '../../shared/constants/utils';
import {
  CustomComponent,
  CustomComponentOutputData,
} from '../../component/custom-screen/components-list.types';
import {
  defaultScreensAmount,
  prepareDataToSendForRepeatableFieldsComponent,
  removeItemFromArrByIndex,
  StateStatus,
} from './repeatable-screen.constant';
import { CachedAnswersService } from '../../shared/services/cached-answers/cached-answers.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-repeatable-screen',
  templateUrl: './repeatable-screen.component.html',
  styleUrls: ['./repeatable-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class RepeatableScreenComponent implements OnInit, AfterViewChecked {
  objectKeys = Object.keys;
  componentId: number;
  isValid: boolean;
  canDeleteFirstScreen: boolean;
  minOccures: number;
  componentValidation: Array<boolean> = [];
  parentComponentId: string;

  /**
   * Словарь для хранения массива компонентов
   */
  screens: { [key: string]: CustomComponent[] };
  propData: DisplayDto;
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    map((label) => label || 'Добавить данные'),
  );

  init$: Observable<DisplayDto> = this.screenService.display$.pipe(
    takeUntil(this.ngUnsubscribe$),
    filter((data) => data.type === ScreenTypes.REPEATABLE || data.type === ScreenTypes.UNIQUE), // TODO: убрать UNIQUE при переезде на REPEATABLE
    tap((data: DisplayDto) => {
      this.propData = data;
      this.initVariable();
      this.initScreens();
    }),
  );
  state$ = new BehaviorSubject<Record<string, string>[]>([]);

  commonError$ = combineLatest([
    this.screenService.componentErrors$,
    this.screenService.component$,
    this.getStateStatus$(),
  ]).pipe(
    filter(([error, component]) => !!error[component.id]),
    map(([error, component, isChangeState]) => {
      let message = '';
      let errors: ScenarioErrorsDto[] = [];
      try {
        errors = JSON.parse(error[component.id]);
      } catch (e) {
        message = error[component.id];
        errors = [];
      }

      return {
        hasError: isChangeState !== 'change',
        message,
        errors,
      };
    }),
  );

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private cachedAnswersService: CachedAnswersService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.init$.subscribe();
    this.eventBusService
      .on('cloneButtonClickEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.createScreen(true));

    this.navigationService.nextStep$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.cachedAnswersService.removeValueFromLocalStorage(this.parentComponentId);
    });
  }

  trackByFunction = (_index: number, item: string): string => item;

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  isScreensAvailable(): boolean {
    const screensAmount: number = Object.keys(this.screens).length;
    const repeatAmount = this.propData.components[0].attrs?.repeatAmount || defaultScreensAmount;

    return screensAmount < repeatAmount;
  }

  changeComponentList(changes: CustomComponentOutputData, index: number): void {
    const state = this.getState();
    this.componentValidation[index] = Object.values(changes).every((item) => item.isValid);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    state[index] = prepareDataToSendForRepeatableFieldsComponent(changes);
    this.saveState(state);
  }

  removeItem(key: string, index: number): void {
    delete this.screens[key];
    let state = this.getState();
    state = removeItemFromArrByIndex(state, index);
    this.componentValidation.splice(index, 1);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    this.saveState(state);
  }

  getState(): Record<string, string>[] {
    return JSON.parse(this.currentAnswersService.state as string);
  }

  saveState(state: Record<string, string>[]): void {
    this.state$.next(state);
    this.currentAnswersService.state = JSON.stringify(state);
    this.cachedAnswersService.setValueToLocalStorage(this.parentComponentId, state);
  }

  getStateStatus$(): Observable<StateStatus> {
    // TODO: refactor когда бэк сделает вывод ошибки для конкректной формы
    return this.state$.pipe(
      pairwise(),
      map(([prev, curr]) => {
        const prevLength = prev.length;
        const currLength = curr.length;
        if (prevLength === 0 || currLength === 0 || prevLength < currLength) {
          return 'init';
        }

        return isEqualObj(prev, curr) ? 'noChange' : 'change';
      }),
    );
  }

  private initScreens(): void {
    for (let i = 0; i < this.minOccures; i += 1) {
      this.createScreen();
    }
  }

  private createScreen(isDuplicate?: boolean): void {
    if (!this.isScreensAvailable()) {
      return;
    }

    const { attrs } = this.propData.components[0];
    const getScreenComponents = (components: unknown[], isFirst: boolean): CustomComponent[] =>
      (components as CustomComponent[]).filter(({ attrs: { onlyFirstScreen = isFirst } }) =>
        isFirst ? onlyFirstScreen : !onlyFirstScreen,
      );

    if (isDuplicate) {
      this.setNewScreen(getScreenComponents(attrs.components, false));
    } else {
      attrs.repeatableComponents.forEach((component, i) => {
        this.setNewScreen(getScreenComponents(component, i < 1) as CustomComponent[]);
      });
    }
  }

  private setNewScreen(components: CustomComponent[]): void {
    const id = this.getNewId();
    this.screens[id] = components;
  }

  private getNewId(): string {
    this.componentId += 1;
    return this.componentId.toString();
  }

  private initVariable(): void {
    this.screens = {};
    this.componentId = 0;
    this.parentComponentId = this.propData.components[0].id;
    this.saveState([]);
    const { canDeleteFirstScreen = true, minOccures = 1 } = this.propData.components[0].attrs;
    this.canDeleteFirstScreen = canDeleteFirstScreen;
    this.minOccures = minOccures;
  }
}
