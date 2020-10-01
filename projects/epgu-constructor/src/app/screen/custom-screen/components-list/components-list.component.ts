import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import * as moment_ from 'moment';
import { ConfigService } from '../../../config/config.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import {
  DictionaryOptions,
  DictionaryResponse,
} from '../../../services/api/dictionary-api/dictionary-api.types';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { ScreenService } from '../../screen.service';
import {
  CustomComponent,
  CustomComponentDictionaryState,
  CustomComponentDropDownStateInterface,
  CustomComponentOutputData,
  CustomComponentState,
  CustomScreenComponentTypes,
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

const moment = moment_;

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnChanges {
  // <-- constant
  componentType = CustomScreenComponentTypes;
  optionalField = OPTIONAL_FIELD;

  // <-- variables
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  state: CustomComponentState = {};
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};
  dropDown: { [key: string]: CustomComponentDropDownStateInterface } = {};

  @Input() components: Array<CustomComponent>;
  @Output() changes = new EventEmitter<CustomComponentOutputData>();

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.state = {};
    if (changes?.components?.currentValue) {
      this.components.forEach((component) => this.initComponent(component));
      this.emmitChanges();
      this.checkDependenceOfTheComponent();
    }
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
    } else if (isDropDown(component)) {
      this.initDropDown(component);
    }
  }

  /**
   * Инициализирует хранилище для компонента
   * @param component - данные компонента
   */
  initState(component: CustomComponent) {
    const errorMessage = this.screenService.componentErrors[component.id] || '';
    this.state[component.id] = getInitStateItemComponentList(component, errorMessage);
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

    // Hardcode для фильтрации моделей ТС
    if (dictionaryType === 'MARKI_TS') {
      this.filterModels(selectedItem.id);
    }
  }

  /**
   * Выбор элемента из выпадающего списка
   * @param $event - событие с данными
   * @param component - данные компонента
   */
  selectDropDown($event: any, component: CustomComponent) {
    this.state[component.id].value = $event.originalItem;
    this.state[component.id].valid = true;
    this.emmitChanges(component);
  }

  /**
   * Обработка изменений данных в компонентах ввода
   * @param $event - событие с элементом
   * @param component - данные компонента
   */
  inputChange($event: Event, component: CustomComponent) {
    let { value } = $event.target as HTMLInputElement;
    if (component.type === this.componentType.AddressInput) {
      value = this.state[component.id].value;
    }
    if (component.type === this.componentType.PhoneNumberChangeInput) {
      const maskSymbolRegExp = /\s|-/g;
      value = value.replace(maskSymbolRegExp, ''); // удаляет скобки, проблемы, тире
    }
    if (component.attrs?.mask) {
      const maskSymbolRegExp = new RegExp(component.attrs?.placeholderSymbol || '_', 'g');
      value = value.replace(maskSymbolRegExp, ''); // удаляет плейсхолдер символы
    }
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationAndValueState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  inputBlur(component: CustomComponent) {
    const { value } = this.state[component.id];
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationAndValueState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  /**
   * Переключение состояния чекбокса отвечающего за видимость или скрытие полей
   * @param $event - событие с элементом
   * @param component - данные компонента
   */
  checkboxChange($event: Event, component: CustomComponent) {
    const { checked } = $event.target as HTMLInputElement;
    this.state[component.id].value = checked;
    this.emmitChanges(component);
  }

  /**
   * Изменение даты в специальном выборе даты
   * @param $event - значение выбранной даты
   * @param component - данные компонента
   */
  dateChange($event: string, component: CustomComponent) {
    const value = moment($event).toISOString();
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationAndValueState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  /**
   * Подгрузка данныъ из справочника
   * @param dictionaryType - тип справочника
   * @param component - данные компонента
   * @param options - опции справочника
   */
  loadDictionary(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions = { pageNum: 0 },
  ) {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.dictionaryApiService.getDictionary(dictionaryType, options).subscribe(
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
  setValidationAndValueState(inputValidationResult, componentId, componentValue) {
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
        this.state[componentId]?.component?.attrs?.validation &&
          this.state[componentId]?.component?.attrs?.validation[inputValidationResult]?.errorMsg,
      );
    }
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
      const { value, valid, disabled, isShown } = val;

      if (!isShown) {
        return acc;
      }

      acc[key] = {
        value: disabled ? '' : value,
        valid,
        disabled,
      };
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

  isInputString(componentType: CustomScreenComponentTypes): boolean | CustomScreenComponentTypes {
    const isLikeMask = [
      CustomScreenComponentTypes.StringInput,
      CustomScreenComponentTypes.PhoneNumberChangeInput,
      CustomScreenComponentTypes.NewEmailInput,
      CustomScreenComponentTypes.OgrnInput,
      CustomScreenComponentTypes.OgrnipInput,
      CustomScreenComponentTypes.PersonInnInput,
      CustomScreenComponentTypes.LegalInnInput,
      CustomScreenComponentTypes.SnilsInput,
    ].includes(componentType);
    return isLikeMask ? componentType : !componentType;
  }

  /**
   * Обновляет словарь с моделями ТС после выбора марки ТС
   */
  filterModels(markId: string | number) {
    const options: DictionaryOptions = {
      filter: {
        simple: {
          attributeName: 'Id_Mark',
          condition: 'EQUALS',
          value: {
            asString: `${markId}`,
          },
        },
      },
    };

    const modelTSComponent = this.components.filter(
      (component) => component.attrs.dictionaryType === 'MODEL_TS',
    )[0];

    this.loadDictionary('MODEL_TS', modelTSComponent, options);
  }
}
