import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, filter, map, pairwise, takeUntil, tap } from 'rxjs/operators';
import {
  ComponentAttrsDto,
  DisclaimerDto,
  DisplayDto,
  ScenarioErrorsDto,
  ScreenTypes,
} from '@epgu/epgu-constructor-types';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { isEqual } from 'lodash';
import { BusEventType, EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import {
  CustomComponent,
  CustomComponentAttr,
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
import { UniquenessErrorsService } from '../../shared/services/uniqueness-errors/uniqueness-errors.service';
import { ComponentsListComponent } from '../../component/custom-screen/components-list.component';

@Component({
  selector: 'epgu-constructor-repeatable-screen',
  templateUrl: './repeatable-screen.component.html',
  styleUrls: ['./repeatable-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class RepeatableScreenComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild(ComponentsListComponent) cmpList: ComponentsListComponent;
  objectKeys = Object.keys;
  componentId: number;
  isValid: boolean;
  canDeleteFirstScreen: boolean;
  screenCaption: string;
  secondScreenCaption: string;
  minOccures: number;
  componentValidation: boolean[] = [];
  parentComponentId: string;
  cacheRepeatableFieldsAnswersLocally: boolean;
  disclaimer: DisclaimerDto;

  isRecording$$ = new BehaviorSubject<boolean>(true);

  get isRecording(): boolean {
    return this.isRecording$$.getValue();
  }

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
    tap(() => this.startRecording()),
    tap((data: DisplayDto) => {
      this.propData = data;
      this.initVariable();
      this.initScreens(this.propData.components[0].attrs);
    }),
  );
  state$ = new BehaviorSubject<Record<string, string>[]>([]);

  commonError$ = combineLatest([
    this.screenService.componentErrors$,
    this.screenService.component$,
    this.getStateStatus$(),
  ]).pipe(
    filter(([componentErrors, component]) => !!componentErrors[component.id]),
    delay(0),
    map(([componentErrors, component, statusState]) => {
      let message = '';
      let errors: ScenarioErrorsDto[] = [];
      try {
        errors =
          this.uniquenessErrorsService.preparedUniquenessErrors ||
          JSON.parse(componentErrors[component.id]);
      } catch (e) {
        message = componentErrors[component.id];
        errors = [];
      }

      return {
        hasError: statusState !== 'change',
        message,
        errors,
      };
    }),
  );

  constructor(
    public screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private cdr: ChangeDetectorRef,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private cachedAnswersService: CachedAnswersService,
    private navigationService: NavigationService,
    private scrollToService: ScrollToService,
    private uniquenessErrorsService: UniquenessErrorsService,
  ) {}

  startRecording(): void {
    this.isRecording$$.next(true);
  }

  stopRecording(): void {
    this.isRecording$$.next(false);
  }

  ngOnInit(): void {
    this.init$.subscribe();
    this.uniquenessErrorsService.init();
    this.eventBusService
      .on(BusEventType.CloneButtonClickEvent)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.createScreen(this.propData.components[0].attrs, true, true));
  }

  ngAfterViewInit(): void {
    this.navigationService.nextStep$
      .pipe(
        tap(() => this.stopRecording()),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.cachedAnswersService.removeValueFromLocalStorage(this.parentComponentId);
      });
  }

  trackByFunction = (_index: number, item: string): string => item;

  triggerScrollTo(target: number | string): void {
    const config: ScrollToConfigOptions = {
      target: String(target),
    };
    setTimeout(() => {
      this.scrollToService.scrollTo(config);
    }, 0);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  isScreensAvailable(): boolean {
    const screensAmount: number = Object.keys(this.screens).length;
    const repeatAmount = this.propData.components[0].attrs?.repeatAmount || defaultScreensAmount;

    const componentAttrs = this.firstComponentAttrs;
    const { isNotDuplicate, dictionaryList } = componentAttrs;

    if (isNotDuplicate && dictionaryList) {
      return dictionaryList.length > screensAmount;
    }

    return screensAmount < repeatAmount;
  }

  changeComponentList(changes: CustomComponentOutputData, index: number): void {
    this.componentValidation[index] = Object.values(changes).every((item) => item.isValid);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);

    const state = this.getState();
    state[index] = prepareDataToSendForRepeatableFieldsComponent(changes);
    this.saveState(state);
    this.uniquenessErrorsService.calculatePreparedUniqErrors(state, index);
  }

  removeItem(key: string, index: number): void {
    delete this.screens[key];
    const keys = Object.keys(this.screens);
    this.triggerScrollTo(keys[keys.length - 1]);
    this.componentValidation.splice(index, 1);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);

    let state = this.getState();
    state = removeItemFromArrByIndex(state, index);
    this.saveState(state);
  }

  getState(): Record<string, string>[] {
    return JSON.parse(this.currentAnswersService.state as string);
  }

  saveState(state: Record<string, string>[]): void {
    this.state$.next(state);
    this.currentAnswersService.state = JSON.stringify(state);
    if (this.cacheRepeatableFieldsAnswersLocally && this.isRecording) {
      this.cachedAnswersService.setValueToLocalStorage(this.parentComponentId, state);
    }
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

        return isEqual(prev, curr) ? 'noChange' : 'change';
      }),
    );
  }

  private initScreens(attrs: ComponentAttrsDto): void {
    if (attrs.repeatableComponents.length < this.minOccures) {
      for (let i = 0; i < this.minOccures; i += 1) {
        this.createScreen(attrs, false, true);
      }
    } else {
      this.createScreen(attrs, false, true);
    }
  }

  private createScreen(
    attrs: ComponentAttrsDto,
    isDuplicate?: boolean,
    initialLoaded?: boolean,
  ): void {
    if (!this.isScreensAvailable()) {
      return;
    }

    const getScreenComponents = (components: unknown[], isFirst: boolean): CustomComponent[] =>
      (components as CustomComponent[]).filter(({ attrs: { onlyFirstScreen = isFirst } }) =>
        isFirst ? onlyFirstScreen : !onlyFirstScreen,
      );

    if (isDuplicate) {
      this.setNewScreen(getScreenComponents(attrs.components, false), initialLoaded);
    } else {
      attrs.repeatableComponents.forEach((component, i) => {
        this.setNewScreen(
          getScreenComponents(component, i < 1) as CustomComponent[],
          initialLoaded,
        );
      });
    }
  }

  private setNewScreen(components: CustomComponent[], initialLoaded?: boolean): void {
    const id = this.getNewId();
    this.screens[id] = components;
    if (!initialLoaded) {
      this.triggerScrollTo(id);
    }
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
    const {
      canDeleteFirstScreen = true,
      minOccures = 1,
      screenCaption,
      secondScreenCaption,
      cacheRepeatableFieldsAnswersLocally = false,
      uniqueBy,
    } = this.propData.components[0].attrs;
    this.canDeleteFirstScreen = canDeleteFirstScreen;
    this.minOccures = minOccures;
    this.screenCaption = screenCaption;
    this.secondScreenCaption = secondScreenCaption;
    this.cacheRepeatableFieldsAnswersLocally = cacheRepeatableFieldsAnswersLocally;
    this.disclaimer = uniqueBy?.disclaimer;
  }

  private get firstComponentAttrs(): CustomComponentAttr {
    return (this.propData.components[0].attrs.components[0]
      .attrs as unknown) as CustomComponentAttr;
  }
}
