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
import * as moment_ from 'moment';
import { DATE_STRING_DOT_FORMAT } from '../../../../constant/global';
import {
  CustomComponentDictionaryState,
  CustomComponentInterface,
  CustomComponentState,
} from '../../../../interfaces/custom-component.interface';
import { DictionaryResponse } from '../../../../interfaces/dictionary-options.interface';
import {
  CUSTOM_COMPONENT_ITEM_TYPE,
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
} from '../../../modules/custom/tools/custom-screen-tools';
import { RestService } from '../../../services/rest/rest.service';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnInit, OnChanges {
  // <-- constant
  componentType = CUSTOM_COMPONENT_ITEM_TYPE;

  // <-- variables
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  state: { [key: string]: CustomComponentState } = {};
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};

  @Input() components;
  @Output() changes = new EventEmitter();

  constructor(private restService: RestService) {}

  ngOnInit(): void {}

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
    if (changes?.components?.currentValue) {
      this.components.forEach((component) => {
        switch (component.type) {
          case CUSTOM_COMPONENT_ITEM_TYPE.Dictionary:
            this.initDictionary(component.attrs.dictionaryType);
            this.loadDictionary(component.attrs.dictionaryType, component);
            break;
          default:
            this.initState(component);
            break;
        }
      });
    }
  }

  selectDictionary(selectedItem: ListItem, component: CustomComponentInterface) {
    const dictionaryName = component.attrs?.dictionaryType;
    this.dictionary[dictionaryName].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = JSON.stringify(selectedItem.originalItem);
    this.state[component.id].valid = true;
    this.changes.emit(this.state);
  }

  setValidationState(inputValidationResult, componentId, componentValue) {
    const handleSetState = (isValid, errMsg?) => {
      this.state[componentId].value = componentValue;
      this.state[componentId].valid = isValid;
      this.state[componentId].errorMessage = errMsg;
      this.changes.emit(this.state);
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
    );
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
    this.dictionary[key].list = getNormalizeDataCustomScreenDictionary(data.items, key);
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

  private initState(component: CustomComponentInterface) {
    const { id } = component;
    const { value } = component;

    let valueFormatted: string | Date;
    switch (component.type) {
      case CUSTOM_COMPONENT_ITEM_TYPE.DateInput:
        valueFormatted = moment(value, DATE_STRING_DOT_FORMAT).toDate() || moment().toDate();
        break;
      default:
        valueFormatted = value;
        break;
    }

    this.state[id] = { valid: false, errorMessage: '', value: valueFormatted, component };
    this.changes.emit(this.state);
  }

  private hasDictionary(type: CUSTOM_COMPONENT_ITEM_TYPE) {
    return (
      CUSTOM_COMPONENT_ITEM_TYPE.Dictionary === type || CUSTOM_COMPONENT_ITEM_TYPE.Lookup === type
    );
  }
}
