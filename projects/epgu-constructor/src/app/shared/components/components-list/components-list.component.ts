import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';

import {
  CustomComponentDictionaryState,
  CustomComponentDropDownStateInterface,
  CustomComponent,
  CustomComponentOutputData,
  CustomComponentState,
} from '../../../screen/custom-screen/types/custom-component.types';
import { DictionaryResponse } from '../../../services/api/dictionary-api/dictionary-api.types';
import {
  adaptiveDropDown,
  calcDependedComponent,
  CheckInputValidationComponentList,
  getCustomScreenDictionaryFirstState,
  getInitStateItemComponentList,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  likeDictionary,
} from '../../../screen/custom-screen/tools/custom-screen-tools';
import { ScreenService } from '../../../screen/screen.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD } from '../../constant/helper-texts';
import { CUSTOM_COMPONENT_ITEM_TYPE } from '../../constant/global';
import { ConfigService } from '../../../config/config.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnChanges {
  // <-- constant
  componentType = CUSTOM_COMPONENT_ITEM_TYPE;

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
    private configService: ConfigService,
  ) {}

  // NOTICE: тут была информация о валидации смотри историю гита

  ngOnInit(): void {
    console.log(this.screenService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.state = {};
    if (changes?.components?.currentValue) {
      this.components.forEach((component) => this.initComponent(component));
      this.emmitChanges();
      this.checkDependenceOfTheComponent();
    }
  }

  /**
   * Инициализирует стейт для компонента.
   */
  initComponent(component: CustomComponent) {
    this.initState(component);
    if (likeDictionary(component.type)) {
      const dictionaryName = component.attrs.dictionaryType;
      this.initDictionary(dictionaryName);
      this.loadDictionary(dictionaryName, component);
    } else if (isDropDown(component.type)) {
      this.initDropDown(component);
    }
  }

  initState(component: CustomComponent) {
    this.state[component.id] = getInitStateItemComponentList(component);
  }

  initDictionary(dictionaryName) {
    this.dictionary[dictionaryName] = getCustomScreenDictionaryFirstState();
  }

  initDropDown(component: CustomComponent) {
    const key = component.id;
    const data = component.attrs.dictionaryList;
    this.dropDown[key] = {
      origin: data,
      list: adaptiveDropDown(data),
    };
  }

  selectDictionary(selectedItem: ListItem, component: CustomComponent) {
    const dictionaryName = component.attrs?.dictionaryType;
    this.dictionary[dictionaryName].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = selectedItem.originalItem;
    this.state[component.id].valid = true;
    this.emmitChanges(component);
  }

  selectDropDown($event: any, componentData: CustomComponent) {
    this.state[componentData.id].value = $event.origin;
    this.emmitChanges();
  }

  inputChange($event: Event, component: CustomComponent) {
    const { value } = $event.target as HTMLInputElement;
    this.state[component.id].value = value;
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  dateChange($event: string, component: CustomComponent) {
    const value = $event;
    this.state[component.id].value = value;
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  loadDictionary(dictionaryName: string, component: CustomComponent) {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.dictionaryApiService.getDictionary(dictionaryName, { pageNum: 0 }).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryName, data, component),
      () => this.loadDictionaryError(dictionaryName),
      () => {
        /* this.changes.emit(this.state) */
      },
    );
  }

  loadDictionarySuccess(key: string, data: DictionaryResponse, component: CustomComponent) {
    this.dictionary[key].loading = false;
    this.dictionary[key].paginationLoading = false;
    this.dictionary[key].data = data;
    this.dictionary[key].origin = component;
    this.dictionary[key].list = getNormalizeDataCustomScreenDictionary(data.items, key, component);
  }

  loadDictionaryError(key: string) {
    this.dictionary[key].loading = false;
    this.dictionary[key].paginationLoading = false;
    this.dictionary[key].loadError = true;
    this.dictionary[key].loadEnd = false;
  }

  setValidationState(inputValidationResult, componentId, componentValue) {
    const handleSetState = (isValid, errMsg?) => {
      this.state[componentId].value = componentValue;
      this.state[componentId].valid = isValid;
      this.state[componentId].errorMessage = errMsg;
      this.emmitChanges();
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

  getHelperText(required: boolean): string {
    return required ? '' : OPTIONAL_FIELD;
  }

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

  private checkDependenceOfTheComponent() {
    this.components.forEach((component) =>
      calcDependedComponent(component, this.state, this.components),
    );
  }
}
