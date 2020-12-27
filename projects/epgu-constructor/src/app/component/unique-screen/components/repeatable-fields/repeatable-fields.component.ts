import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import {
  defaultScreensAmount,
  prepareDataToSendForRepeatableFieldsComponent,
  removeItemFromArrByIndex,
} from './repeatable-fields.constant';
import {
  CustomComponent,
  CustomComponentOutputData,
} from '../../../components-list/components-list.types';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-repeatable-fields',
  templateUrl: './repeatable-fields.component.html',
  styleUrls: ['./repeatable-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class RepeatableFieldsComponent implements AfterViewChecked {
  @Output() nextStepEvent = new EventEmitter();

  objectKeys = Object.keys;
  componentId: number;
  isValid: boolean;
  componentValidation: Array<boolean> = [];

  /**
   * Словарь для хранения массива компонентов
   */
  screens: { [key: string]: CustomComponent[] };
  propData: DisplayDto;
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    map((label) => label || 'Добавить данные'),
  );
  data$: Observable<DisplayDto> = this.screenService.display$;
  init$: Observable<DisplayDto> = this.data$.pipe(
    filter((data) => data.type === ScreenTypes.UNIQUE),
    tap((data: DisplayDto) => {
      this.initVariable();
      this.propData = data;

      this.duplicateScreen();
    }),
  );

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
  ) {}

  trackByFunction = (index, item): string => item;

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  isScreensAvailable(): boolean {
    const screensAmount: number = Object.keys(this.screens).length;

    return (
      screensAmount < this.propData.components[0].attrs?.repeatAmount ||
      screensAmount < defaultScreensAmount
    );
  }

  duplicateScreen(isNew?: boolean): void {
    const isScreensAvailable = this.isScreensAvailable();
    if (isScreensAvailable && isNew) {
      this.setNewScreen(this.propData.components[0].attrs.components as CustomComponent[]);
    } else if (isScreensAvailable) {
      this.propData.components[0].attrs.repeatableComponents.forEach((component) => {
        this.setNewScreen((component as unknown) as CustomComponent[]);
      });
    }
  }

  // TODO
  changeComponentList(changes: CustomComponentOutputData, index: number): void {
    const state = this.getState();
    this.componentValidation[index] = Object.values(changes).every((item) => item.isValid);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    state[index] = prepareDataToSendForRepeatableFieldsComponent(changes);
    this.saveState(state);
  }

  nextScreen(): void {
    this.nextStepEvent.emit(this.currentAnswersService.state);
  }

  removeItem(key: string, index: number): void {
    delete this.screens[key];
    let state = this.getState();
    state = removeItemFromArrByIndex(state, index);
    this.componentValidation.splice(index, 1);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    this.saveState(state);
  }

  getState(): Array<{ [key: string]: { value: string } }> {
    return JSON.parse(this.currentAnswersService.state as string);
  }

  saveState(state: Array<{ [key: string]: { value: string } }>): void {
    this.currentAnswersService.state = JSON.stringify(state);
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
    this.saveState([]);
  }
}
