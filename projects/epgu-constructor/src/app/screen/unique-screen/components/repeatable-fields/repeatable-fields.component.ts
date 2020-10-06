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
    console.group('debug');
    console.log(this.screens, this.screenService.getStore());
    console.groupEnd();
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

  changeComponentList(changes, index: number) {
    const state = this.getState();
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
    this.saveState(state);
  }

  getState() {
    return JSON.parse(this.currentAnswersService.state);
  }
  saveState(state) {
    this.currentAnswersService.state = JSON.stringify(state);
  }
}
