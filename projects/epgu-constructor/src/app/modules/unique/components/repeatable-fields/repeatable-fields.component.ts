import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';

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
    this.propData = data;
    this.initVariable();
    this.screens[this.getId()] = data.components[0].attrs.components;
  }
  @Output() nextStepEvent = new EventEmitter();

  /**
   * Генерирует уникальный идентификатор массива компонентов для {@link screens}
   */
  // eslint-disable-next-line
  getId = () => (this.componentId += 1);

  constructor(
    private componentStateService: ComponentStateService,
    public constructorService: ConstructorService,
  ) {}

  ngOnInit(): void {}

  private initVariable() {
    this.screens = {};
    this.componentId = 0;
    this.componentStateService.state = {};
  }

  duplicateScreen() {
    this.screens[this.getId()] = this.propData.components[0].attrs.components;
  }

  changeComponentList({ value }, screenKey) {
    this.componentStateService.state[screenKey] = value;
  }

  nextScreen() {
    this.nextStepEvent.emit();
  }

  removeItem(key: string) {
    delete this.screens[key];
    delete this.componentStateService.state[key];
  }
}
