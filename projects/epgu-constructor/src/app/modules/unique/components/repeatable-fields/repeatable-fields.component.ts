import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import {
  prepareDataToSendForRepeatableFieldsComponent,
  removeItemFromArrByIndex,
} from './repeatable-fields.constant';

@Component({
  selector: 'epgu-constructor-repeatable-fields',
  templateUrl: './repeatable-fields.component.html',
  styleUrls: ['./repeatable-fields.component.scss'],
  providers: [ConstructorService],
})
export class RepeatableFieldsComponent implements OnInit {
  objectKeys = Object.keys;
  componentId;

  /**
   * Словарь для хранения массива компонентов
   */
  screens: { [key: string]: any };
  propData; // TODO указать тип

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
    private componentStateService: ComponentStateService,
    public constructorService: ConstructorService,
  ) {}

  ngOnInit(): void {}

  private initVariable() {
    this.screens = {};
    this.componentId = 0;
    this.componentStateService.state = [];
  }

  duplicateScreen() {
    this.screens[this.getId()] = this.propData.components[0].attrs.components;
  }

  changeComponentList(changes, index: number) {
    this.componentStateService.state[index] = prepareDataToSendForRepeatableFieldsComponent(
      changes,
    );
  }

  nextScreen() {
    this.nextStepEvent.emit(this.componentStateService.state);
  }

  removeItem(key: string, index: number) {
    delete this.screens[key];
    this.componentStateService.state = removeItemFromArrByIndex(
      this.componentStateService.state,
      index,
    );
  }
}
