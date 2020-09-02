import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import * as moment_ from 'moment';
import { DATE_STRING_DOT_FORMAT } from '../../../../constant/global';
import {
  CustomComponentDictionaryState,
  CustomComponentDropDownStateInterface,
  CustomComponentInterface,
  CustomComponentState,
} from '../../../../interfaces/custom-component.interface';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../interfaces/dictionary-options.interface';
import {
  CUSTOM_COMPONENT_ITEM_TYPE,
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
  adaptiveDropDown,
  likeDictionary,
  isDropDown,
} from '../../../screen/custom-screen/tools/custom-screen-tools';
import { RestService } from '../../../services/rest/rest.service';
import { OPTIONAL_FIELD } from '../../../../constant/helperTexts';

const moment = moment_;

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
  state: { [key: string]: CustomComponentState } = {};
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};
  dropDown: { [key: string]: CustomComponentDropDownStateInterface } = {};

  @Input() components: Array<CustomComponentInterface>;
  @Output() changes = new EventEmitter();

  constructor(private restService: RestService) {}

  // // TODO Где-то надо будет включить эту проверку
  // asdasd() {
  //   // TODO добавить валидацию и проверку заполнения всех полей помимо StringInput
  //   const responseData = {};
  //   let isValid = true;
  //   Object.keys(this.state).forEach((key) => {
  //     if (this.state[key].component.type === CUSTOM_COMPONENT_ITEM_TYPE.StringInput) {
  //       const inputValidationResult = this.checkInputValidation(
  //         this.state[key].value,
  //         this.state[key].component,
  //       );

  //       this.setValidationState(
  //         inputValidationResult,
  //         this.state[key]?.component?.id,
  //         this.state[key]?.value,
  //       );

  //       if (inputValidationResult > -1) {
  //         isValid = false;
  //       }
  //     }
  //   });

  //   this.validationShowOn = ValidationShowOn.IMMEDIATE;

  //   if (isValid) {
  //     Object.keys(this.state).forEach((key) => {
  //       responseData[key] = { visited: true, value: JSON.stringify(this.state[key].value || {}) };
  //     });
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    this.state = {};
    if (changes?.components?.currentValue) {
      this.components.forEach((component) => {
        this.initState(component);
        if (likeDictionary(component.type)) {
          const dictionaryName = component.attrs.dictionaryType;
          this.initDictionary(dictionaryName);
          this.loadDictionary(dictionaryName, component);
        } else if (isDropDown(component.type)) {
          this.initDropDown(component);
        }
      });
      this.emmitChanges();
    }
  }

  selectDictionary(selectedItem: ListItem, component: CustomComponentInterface) {
    const dictionaryName = component.attrs?.dictionaryType;
    this.dictionary[dictionaryName].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = selectedItem.originalItem;
    this.state[component.id].valid = true;
    this.calcDependedComponent(component);
    this.emmitChanges();
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

  inputChange($event: Event, component: CustomComponentInterface) {
    const { value } = $event.target as HTMLInputElement;
    const inputValidationResult = this.checkInputValidation(value, component);

    this.setValidationState(inputValidationResult, component.id, value);
  }

  checkInputValidation(value: string, component: CustomComponentInterface): number {
    const regExpArr = component?.attrs?.validation?.map((item) => {
      try {
        return new RegExp(item.value);
      } catch {
        // eslint-disable-next-line no-console
        console.error(`Неверный формат RegExp выражения: ${item.value}. Заменено на /.*/`);
        return new RegExp(/.*/);
      }
    });

    let result = -1; // if result === -1 input value is considered valid

    if (regExpArr) {
      regExpArr.every((regExp, index) => {
        if (!regExp.test(value)) {
          result = index;
          return false;
        }
        return true;
      });
    }

    return result;
  }

  loadDictionary(dictionaryName: string, component: CustomComponentInterface) {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.restService.getDictionary(dictionaryName, { pageNum: 0 }).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryName, data, component),
      () => this.loadDictionaryError(dictionaryName),
      () => this.changes.emit(this.state),
    );
  }

  private initDropDown(component: CustomComponentInterface) {
    const key = component.id;
    const data = component.attrs.dictionaryList;
    this.dropDown[key] = {
      origin: data,
      list: adaptiveDropDown(data),
    };
  }

  loadDictionarySuccess(
    key: string,
    data: DictionaryResponse,
    component: CustomComponentInterface,
  ) {
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

  initDictionary(dictionaryName) {
    this.dictionary[dictionaryName] = getCustomScreenDictionaryFirstState();
  }

  getHelperText(required: boolean): string {
    return required ? '' : OPTIONAL_FIELD;
  }

  private initState(component: CustomComponentInterface) {
    const { id, value } = component;
    const hasRelatedRef = component.attrs.ref?.length;

    let valueFormatted: string | Date;
    switch (component.type) {
      case CUSTOM_COMPONENT_ITEM_TYPE.DateInput:
        valueFormatted = moment(value, DATE_STRING_DOT_FORMAT).toDate() || moment().toDate();
        break;
      default:
        valueFormatted = value;
        break;
    }

    this.state[id] = {
      valid: false,
      errorMessage: '',
      value: valueFormatted,
      component,
      isShow: !hasRelatedRef,
    };
    this.emmitChanges();
  }

  private calcDependedComponent(component: CustomComponentInterface) {
    const isComponentDependOn = (arr = []) => arr?.some((el) => el.relatedRel === component.id);
    // TODO добавить возможность зависить от нескольких полей
    const dependentComponents = this.components.filter((item) =>
      isComponentDependOn(item.attrs?.ref),
    );

    dependentComponents.forEach((dependentComponent) => {
      if (likeDictionary(component.type)) {
        const dictionaryOfTheDependentComponent: DictionaryItem = this.state[component.id]?.value;

        // TODO Временный hardcode;
        this.state[dependentComponent.id].isShow =
          dependentComponent.attrs.ref[0].val === dictionaryOfTheDependentComponent.value; // TODO добавить возможность зависить от нескольких полей
      }
    });
  }

  selectDropDown($event: any, componentData: CustomComponentInterface) {
    this.state[componentData.id].value = $event.origin;
    this.emmitChanges();
  }

  emmitChanges() {
    this.changes.emit(this.state);
  }
}
