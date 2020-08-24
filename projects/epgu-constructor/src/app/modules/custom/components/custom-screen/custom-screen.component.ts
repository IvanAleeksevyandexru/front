import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { DATE_STRING_DOT_FORMAT } from '../../../../../constant/global';
import {
  CustomComponentDictionaryState,
  CustomComponentInterface,
  CustomComponentState,
  CustomDisplayInterface,
} from '../../../../../interfaces/custom-component.interface';
import { DictionaryResponse } from '../../../../../interfaces/dictionary-options.interface';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { RestService } from '../../../../services/rest/rest.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import {
  CUSTOM_COMPONENT_ITEM_TYPE,
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
} from '../../tools/custom-screen-tools';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class CustomScreenComponent implements OnChanges {
  // <-- constant
  componentType = CUSTOM_COMPONENT_ITEM_TYPE;

  // <-- variables
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  state: { [key: string]: CustomComponentState } = {};
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};

  @Input() data: CustomDisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private restService: RestService,
    private navService: NavigationService,
    public constructorService: ConstructorService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.state = {};
      this.data.components.forEach((component) => {
        if (component.type !== CUSTOM_COMPONENT_ITEM_TYPE.LabelSection) {
          this.initState(component);
        }
        if (component.type === CUSTOM_COMPONENT_ITEM_TYPE.Dictionary) {
          const dictionaryName = component.attrs.dictionaryType;
          this.initDictionary(dictionaryName);
          this.loadDictionary(dictionaryName, component);
        }
      });
    }
  }

  nextScreen() {
    // TODO добавить валидацию и проверку заполнения всех полей помимо StringInput
    const responseData = {};
    let isValid = true;
    Object.keys(this.state).forEach((key) => {
      if (this.state[key].component.type === CUSTOM_COMPONENT_ITEM_TYPE.StringInput) {
        const inputValidationResult = this.checkInputValidation(
          this.state[key].value,
          this.state[key].component,
        );
        this.setValidationState(
          inputValidationResult,
          this.state[key]?.component?.id,
          this.state[key]?.value,
        );
        if (inputValidationResult > -1) {
          isValid = false;
        }
      } else if (this.state[key].component.type === CUSTOM_COMPONENT_ITEM_TYPE.DateInput) {
        this.state[key].value = moment(this.state[key].value).format(DATE_STRING_DOT_FORMAT);
      }
    });

    this.validationShowOn = ValidationShowOn.IMMEDIATE;

    if (isValid) {
      Object.keys(this.state).forEach((key) => {
        const responseValue = this.state[key].value;
        responseData[key] =
          typeof responseValue === 'object'
            ? { visited: true, value: JSON.stringify(responseValue || {}) }
            : { visited: true, value: responseValue };
      });
      this.nextStepEvent.emit(responseData);
      this.validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
    }
  }

  selectDictionary(selectedItem: ListItem, component: CustomComponentInterface) {
    const dictionaryName = component.attrs?.dictionaryType;
    this.dictionary[dictionaryName].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = selectedItem.originalItem;
    this.state[component.id].valid = true;
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

  // dateChange($event: any, componentData: ComponentInterface) {
  //   console.log($event, componentData)
  // }

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

  // <------------ tools
  initDictionary(dictionaryName) {
    this.dictionary[dictionaryName] = getCustomScreenDictionaryFirstState();
  }

  private initState(component: CustomComponentInterface) {
    const { id, value } = component;
    this.state[id] = { valid: false, errorMessage: '', value, component };
  }
}
