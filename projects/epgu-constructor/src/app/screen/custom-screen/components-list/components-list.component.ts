import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { DictionaryResponse } from '../../../services/api/dictionary-api/dictionary-api.types';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';
import {
  CustomComponent,
  CustomComponentDictionaryState,
  CustomComponentDropDownStateInterface,
  CustomComponentOutputData,
  CustomComponentState,
  CustomScreenComponentTypes,
  ToggleFields,
} from '../custom-screen.types';
import {
  adaptiveDropDown,
  calcDependedComponent,
  CheckInputValidationComponentList,
  getCustomScreenDictionaryFirstState,
  getInitStateItemComponentList,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  likeDictionary,
} from '../tools/custom-screen-tools';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../screen.service';
import { ConfigService } from '../../../config/config.service';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnChanges {
  // <-- constant
  componentType = CustomScreenComponentTypes;

  // <-- variables
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  state: CustomComponentState = {};
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};
  dropDown: { [key: string]: CustomComponentDropDownStateInterface } = {};
  toggleFieldsData$: BehaviorSubject<ToggleFields> = new BehaviorSubject<ToggleFields>({
    disabled: {},
    hide: {},
  });

  private list: Array<CustomComponent>;
  @Input() set components(components: Array<CustomComponent>) {
    this.list = components;
    this.setComponentsToggleFieldsData(components);
  }
  get components(): Array<CustomComponent> {
    return this.list;
  }
  @Output() changes = new EventEmitter<CustomComponentOutputData>();

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {}

  // NOTICE: тут была информация о валидации смотри историю гита

  /**
   * Перебираем компоненты и ищем сведении о переключании состояня полей
   * @param components - компоненты на странице
   * @private
   */
  private setComponentsToggleFieldsData(components: Array<CustomComponent>) {
    components.forEach((component) => {
      if (component.type === CustomScreenComponentTypes.FieldsToggler) {
        const { toggleFields } = component.attrs;
        this.setComponentToggleFieldsData(toggleFields, component);
      }
    });
  }

  /**
   * Устанавливает сведения о полях и их показе/скрытии и/или доступности/недоступности
   * @param toggleFields - данные о переключаемых состояниях полях
   * @param component - данные компонента
   * @private
   */
  private setComponentToggleFieldsData(toggleFields: ToggleFields, component: CustomComponent) {
    const value = Object.assign(this.toggleFieldsData$.getValue(), toggleFields);
    if (this.state[component.id]?.value) {
      this.state[component.id].value = value;
    }
    this.toggleFieldsData$.next(value);
  }

  /**
   * Инициализирует хранилище для компонента и подгружает необходимые данные
   * @param component - данные компонента
   */
  initComponent(component: CustomComponent) {
    this.initState(component);
    if (likeDictionary(component.type)) {
      const { dictionaryType } = component.attrs;
      this.initDictionary(dictionaryType, component.id);
      this.loadDictionary(dictionaryType, component);
    } else if (isDropDown(component.type)) {
      this.initDropDown(component);
    }
  }

  /**
   * Инициализирует хранилище для компонента
   * @param component - данные компонента
   */
  initState(component: CustomComponent) {
    this.state[component.id] = getInitStateItemComponentList(component);
  }

  /**
   * Инициализация справочника
   * @param dictionaryType - тип справочника
   * @param componentId - id компонента
   */
  initDictionary(dictionaryType, componentId) {
    this.dictionary[dictionaryType + componentId] = getCustomScreenDictionaryFirstState();
  }

  /**
   * Инициализирует работу выпадающего списка
   * @param component - данные компонента
   */
  initDropDown(component: CustomComponent) {
    const key = component.id;
    const data = component.attrs.dictionaryList;
    this.dropDown[key] = {
      origin: data,
      list: adaptiveDropDown(data),
    };
  }

  /**
   * Выбор элемента из справочника
   * @param selectedItem - выбранный элемент
   * @param component - данные компонента
   */
  selectDictionary(selectedItem: ListItem, component: CustomComponent) {
    const dictionaryType = component.attrs?.dictionaryType;
    this.dictionary[dictionaryType + component.id].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = selectedItem.originalItem;
    this.state[component.id].valid = true;
    this.emmitChanges(component);
  }

  /**
   * Выбор элемента из выпадающего списка
   * @param $event - событие с данными
   * @param component - данные компонента
   */
  selectDropDown($event: any, component: CustomComponent) {
    this.state[component.id].value = $event.origin;
    this.emmitChanges();
  }

  /**
   * Обработка изменений данных в компонентах ввода
   * @param $event - событие с элементом
   * @param component - данные компонента
   */
  inputChange($event: Event, component: CustomComponent) {
    const { value } = $event.target as HTMLInputElement;
    this.state[component.id].value = value;
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  /**
   * Переключает состояние полей на противоположное для компонента переключения видимости полей
   * @param toggleFields - объект с полями для переключения
   * @private
   */
  private mapFieldsTogglerChange(toggleFields: any) {
    return Object.keys(toggleFields).reduce((result, k: string) => {
      // eslint-disable-next-line no-param-reassign
      result[k] = !toggleFields[k];
      return result;
    }, {});
  }

  /**
   * Переключение состояния чекбокса отвечающего за видимость или скрытие полей
   * @param $event - событие с элементом
   * @param component - данные компонента
   */
  checkboxFieldsTogglerChange($event: Event, component: CustomComponent) {
    const { toggleFields } = component.attrs;
    if (toggleFields.disabled) {
      toggleFields.disabled = this.mapFieldsTogglerChange(toggleFields.disabled);
    }
    if (toggleFields.hide) {
      toggleFields.hide = this.mapFieldsTogglerChange(toggleFields.hide);
    }
    this.setComponentToggleFieldsData(toggleFields, component);
  }

  /**
   * Изменение даты в специальном выборе даты
   * @param $event - значение выбранной даты
   * @param component - данные компонента
   */
  dateChange($event: string, component: CustomComponent) {
    const value = moment($event).format(DATE_STRING_DOT_FORMAT);
    this.state[component.id].value = value;
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  /**
   * Подгрузка данныъ из справочника
   * @param dictionaryType - тип справочника
   * @param component - данные компонента
   */
  loadDictionary(dictionaryType: string, component: CustomComponent) {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.dictionaryApiService.getDictionary(dictionaryType, { pageNum: 0 }).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryType, data, component),
      () => this.loadDictionaryError(dictionaryType, component.id),
      () => {
        /* this.changes.emit(this.state) */
      },
    );
  }

  /**
   * Обработка ситуации когда произошла успешная подгрузка данных справочника и мы получает список значений
   * @param dictionaryType - тип справочника
   * @param data - данные из запроса
   * @param component - данные компонента
   */
  loadDictionarySuccess(
    dictionaryType: string,
    data: DictionaryResponse,
    component: CustomComponent,
  ) {
    const id = dictionaryType + component.id;
    this.dictionary[id].loading = false;
    this.dictionary[id].paginationLoading = false;
    this.dictionary[id].data = data;
    this.dictionary[id].origin = component;
    this.dictionary[id].list = getNormalizeDataCustomScreenDictionary(
      data.items,
      dictionaryType,
      component,
    );
  }

  /**
   * Обработка ситуации когда подгрузка данных справочника произошла ошибкой
   * @param dictionaryType - тип справочника
   * @param componentId - id компонента
   */
  loadDictionaryError(dictionaryType: string, componentId: string) {
    const id = dictionaryType + componentId;
    this.dictionary[id].loading = false;
    this.dictionary[id].paginationLoading = false;
    this.dictionary[id].loadError = true;
    this.dictionary[id].loadEnd = false;
  }

  /**
   * Устанавливает состояние валидности для компонента
   * @param inputValidationResult - результат валидации
   * @param componentId - id компоненота
   * @param componentValue - значение компонента
   */
  setValidationState(inputValidationResult, componentId, componentValue) {
    const handleSetState = (isValid, errMsg?) => {
      this.state[componentId].value = componentValue;
      this.state[componentId].valid = isValid;
      this.state[componentId].errorMessage = errMsg;
    };

    if (inputValidationResult === -1) {
      handleSetState(true);
    } else {
      handleSetState(
        false,
        this.state[componentId]?.component.attrs.validation[inputValidationResult].errorMsg,
      );
    }
  }

  /**
   * Позвращает подпись
   * @param required - обязательное поле или нет
   */
  getHelperText(required: boolean): string {
    return required ? '' : OPTIONAL_FIELD;
  }

  /**
   * Отправляем данные на следующий экран
   * @param component - данные компонента
   */
  emmitChanges(component?: CustomComponent) {
    if (component) {
      calcDependedComponent(component, this.state, this.components);
    }
    const prepareStateForSending = this.getPreparedStateForSending();
    this.changes.emit(prepareStateForSending);
  }

  /**
   * Подгатавливаются данные для пробраса на верх.
   * Родительскому компоненту нужны данные компонента и состояние валидности.
   */
  private getPreparedStateForSending() {
    return Object.entries(this.state).reduce((acc, [key, val]) => {
      const { value, valid, isShown } = val;
      if (isShown) {
        acc[key] = { value, valid };
      }
      return acc;
    }, {});
  }

  /**
   * Проверяем зависимости компонентов и перезаписывает состояние в state
   * @private
   */
  private checkDependenceOfTheComponent() {
    this.components.forEach((component) =>
      calcDependedComponent(component, this.state, this.components),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.state = {};
    if (changes?.components?.currentValue) {
      this.components.forEach((component) => this.initComponent(component));
      this.emmitChanges();
      this.checkDependenceOfTheComponent();
    }
  }
}
