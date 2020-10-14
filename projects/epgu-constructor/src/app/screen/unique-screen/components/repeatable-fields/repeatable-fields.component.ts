import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentAnswersService } from '../../../current-answers.service';
import { ScreenService } from '../../../screen.service';
import {
  prepareDataToSendForRepeatableFieldsComponent,
  removeItemFromArrByIndex,
} from './repeatable-fields.constant';

@Component({
  selector: 'epgu-constructor-repeatable-fields',
  templateUrl: './repeatable-fields.component.html',
  styleUrls: ['./repeatable-fields.component.scss'],
})
export class RepeatableFieldsComponent {
  objectKeys = Object.keys;
  componentId;
  isValid: boolean;
  componentValidation: Array<boolean> = [];

  /**
   * Словарь для хранения массива компонентов
   */
  screens: { [key: string]: any };
  propData; // TODO указать тип

  @Input() isLoading: boolean;
  @Input() set data(data) {
    this.initVariable();
    this.propData = data;
    this.screens[this.getId()] = data.components[0].attrs.components;
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
  ) {}

  private initVariable() {
    this.screens = {};
    this.componentId = 0;
    this.saveState([]);
  }

  duplicateScreen() {
    this.screens[this.getId()] = this.propData.components[0].attrs.components;
  }

  changeComponentList(changes: { [key: string]: any }, index: number) {
    const state = this.getState();
    setTimeout(() => {
      this.isValid = Object.values(changes).every((item) => item.isValid);
    }, 0);
    this.componentValidation[index] = this.isValid;
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
    delete this.componentValidation[index];
    this.isValid = this.componentValidation.every((valid: boolean) => valid);
    this.saveState(state);
  }

  getState(): { [key: string]: any } {
    return JSON.parse(this.currentAnswersService.state);
  }
  saveState(state) {
    this.currentAnswersService.state = JSON.stringify(state);
  }
}
