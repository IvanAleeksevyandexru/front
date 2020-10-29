import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import {
  prepareDataToSendForRepeatableFieldsComponent,
  removeItemFromArrByIndex,
} from './repeatable-fields.constant';
import { CustomComponent } from '../../../custom-screen/custom-screen-components.types';

@Component({
  selector: 'epgu-constructor-repeatable-fields',
  templateUrl: './repeatable-fields.component.html',
  styleUrls: ['./repeatable-fields.component.scss'],
})
export class RepeatableFieldsComponent implements AfterViewChecked {
  objectKeys = Object.keys;
  componentId;
  isValid: boolean;
  componentValidation: Array<boolean> = [];

  /**
   * Словарь для хранения массива компонентов
   */
  screens: { [key: string]: any };
  propData; // TODO указать тип
  cache: { [key: string]: any } = {};

  @Input() isLoading: boolean;
  @Input() set data(data) {
    this.cache = this.screenService.getStore().cachedAnswers[this.screenService.component.id];
    this.initVariable();
    this.propData = data;

    const isCached = Object.keys(this.cache || {}).length;

    if (isCached) {
      this.duplicateScreenAndPatch();
    } else {
      this.duplicateScreen();
    }
  }
  @Output() nextStepEvent = new EventEmitter();

  /**
   * Генерирует уникальный идентификатор массива компонентов для {@link screens}
   */
  // eslint-disable-next-line
  getId = () => (this.componentId += 1);
  trackByFunction = (index, item) => item;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  private initVariable() {
    this.screens = {};
    this.componentId = 0;
    this.saveState([]);
  }

  isScreensAvailable(): boolean {
    const screensAmount: number = Object.keys(this.screens).length;
    const defaultAvailable = 20;
    return (
      screensAmount < this.propData.components[0].attrs?.repeatAmount ||
      screensAmount < defaultAvailable
    );
  }

  duplicateScreen() {
    if (this.isScreensAvailable()) {
      this.screens[this.getId()] = this.propData.components[0].attrs.components;
    }
  }

  changeComponentList(changes: { [key: string]: any }, index: number) {
    const state = this.getState();
    this.componentValidation[index] = Object.values(changes).every((item) => item.isValid);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    state[index] = prepareDataToSendForRepeatableFieldsComponent(changes);
    this.saveState(state);
  }

  nextScreen() {
    this.nextStepEvent.emit(this.currentAnswersService.state);
  }

  removeItem(key: string, index: number) {
    delete this.screens[key];
    let state = this.getState();
    state = removeItemFromArrByIndex(state, index);
    this.componentValidation.splice(index, 1);
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    this.saveState(state);
  }

  getState(): { [key: string]: any } {
    return JSON.parse(this.currentAnswersService.state);
  }
  saveState(state) {
    this.currentAnswersService.state = JSON.stringify(state);
  }

  private duplicateScreenAndPatch(): void {
    let cache;
    try {
      cache = JSON.parse(this.cache.value);
    } catch (e) {
      cache = {};
    }
    Object.keys(cache).forEach((key: string) => {
      this.duplicateScreen();
      Object.entries(cache[key]).forEach(([componentId, value]) => {
        const index: number = Object.keys(this.screens).length;
        this.screens[index] = this.screens[index].map((component: CustomComponent) => {
          if (component.id === componentId) {
            return { ...component, value };
          }
          return { ...component };
        });
      });
    });
  }
}
