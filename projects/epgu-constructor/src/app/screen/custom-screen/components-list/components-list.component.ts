import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import { ConfigService } from '../../../config/config.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { DictionaryResponse } from '../../../services/api/dictionary-api/dictionary-api.types';
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
  checkLegalInn,
  CheckInputValidationComponentList,
  getCustomScreenDictionaryFirstState,
  getInitStateItemComponentList,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  likeDictionary,
  checkPersonInn,
} from '../tools/custom-screen-tools';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnInit, OnChanges {
  // <-- constant
  componentType = CustomScreenComponentTypes;

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

  // NOTICE: тут была информация о валидации смотри историю гита

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
      const { dictionaryType } = component.attrs;
      this.initDictionary(dictionaryType, component.id);
      this.loadDictionary(dictionaryType, component);
    } else if (isDropDown(component.type)) {
      this.initDropDown(component);
    }
  }

  initState(component: CustomComponent) {
    this.state[component.id] = getInitStateItemComponentList(component);
  }

  initDictionary(dictionaryType, componentId) {
    this.dictionary[dictionaryType + componentId] = getCustomScreenDictionaryFirstState();
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
    const dictionaryType = component.attrs?.dictionaryType;
    this.dictionary[dictionaryType + component.id].selectedItem = selectedItem.originalItem;
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

  loadDictionarySuccess(key: string, data: DictionaryResponse, component: CustomComponent) {
    const id = key + component.id;
    this.dictionary[id].loading = false;
    this.dictionary[id].paginationLoading = false;
    this.dictionary[id].data = data;
    this.dictionary[id].origin = component;
    this.dictionary[id].list = getNormalizeDataCustomScreenDictionary(data.items, key, component);
  }

  loadDictionaryError(key: string, componentId: string) {
    const id = key + componentId;
    this.dictionary[id].loading = false;
    this.dictionary[id].paginationLoading = false;
    this.dictionary[id].loadError = true;
    this.dictionary[id].loadEnd = false;
  }

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

  legalInnInputChange($event: Event, component: CustomComponent) {
    const { value } = $event.target as HTMLInputElement;
    this.state[component.id].value = value;
    const inputValidationResult = checkLegalInn(value);
    this.setValidationState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
  }

  personInnInputChange($event: Event, component: CustomComponent) {
    const { value } = $event.target as HTMLInputElement;
    this.state[component.id].value = value;
    const inputValidationResult = checkPersonInn(value);
    this.setValidationState(inputValidationResult, component.id, value);
    this.emmitChanges(component);
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

  ngOnInit(): void {}
}
