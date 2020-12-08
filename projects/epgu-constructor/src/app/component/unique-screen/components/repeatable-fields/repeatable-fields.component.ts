import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import {
  defaultScreensAmount,
  prepareDataToSendForRepeatableFieldsComponent,
  removeItemFromArrByIndex,
} from './repeatable-fields.constant';
import {
  CustomComponentOutputData,
  CustomComponent,
} from '../../../components-list/components-list.types';
import { Answer } from '../../../../shared/types/answer';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

type Changes = {
  [key: string]: {
    isValid: boolean;
    valid: boolean;
    value: string;
  };
};

@Component({
  selector: 'epgu-constructor-repeatable-fields',
  templateUrl: './repeatable-fields.component.html',
  styleUrls: ['./repeatable-fields.component.scss'],
})
export class RepeatableFieldsComponent implements AfterViewChecked {
  objectKeys = Object.keys;
  componentId: number;
  isValid: boolean;
  componentValidation: Array<boolean> = [];

  /**
   * Словарь для хранения массива компонентов
   */
  screens: { [key: string]: CustomComponent[] };
  propData: DisplayDto;
  cache: Answer;
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    map((label) => {
      return label || 'Добавить данные';
    }),
  );

  @Input() set data(data: DisplayDto) {
    this.cache = this.getCache();
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

  trackByFunction = (index, item): string => item;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  private initVariable(): void {
    this.screens = {};
    this.componentId = 0;
    this.saveState([]);
  }

  isScreensAvailable(): boolean {
    const screensAmount: number = Object.keys(this.screens).length;

    return (
      screensAmount < this.propData.components[0].attrs?.repeatAmount ||
      screensAmount < defaultScreensAmount
    );
  }

  duplicateScreen(): void {
    if (this.isScreensAvailable()) {
      const id = this.getNewId();
      this.screens[id] = this.propData.components[0].attrs.components as CustomComponent[];
    }
  }

  private getNewId(): string {
    this.componentId += 1;
    return this.componentId.toString();
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
    return JSON.parse(this.currentAnswersService.state);
  }
  saveState(state: Array<{ [key: string]: { value: string } }>): void {
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
            return { ...component, value: value as string };
          }
          return { ...component } as CustomComponent;
        });
      });
    });
  }

  private getCache(): Answer {
    return this.screenService.getStore().cachedAnswers[this.screenService.component.id];
  }
}
