import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import {
  CustomComponentDictionaryState,
  CustomComponentState,
  EgpuResponseCustomComponentDisplayComponentInterface,
  EgpuResponseCustomComponentDisplayInterface,
} from '../../../../../interfaces/custom-component.interface';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../../interfaces/dictionary-options.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { RestService } from '../../../../services/rest/rest.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { CUSTOM_COMPONENT_ITEM_TYPE } from '../../tools/custom-screen-tools';

@Component({
  selector: 'app-custom-screen',
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

  @Input() data: EgpuResponseCustomComponentDisplayInterface;
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
      }
    });

    this.validationShowOn = ValidationShowOn.IMMEDIATE;

    if (isValid) {
      Object.keys(this.state).forEach((key) => {
        responseData[key] = { visited: true, value: JSON.stringify(this.state[key].value || {}) };
      });
      this.nextStepEvent.emit(responseData);
    }
  }

  selectDictionary(
    selectedItem: ListItem,
    component: EgpuResponseCustomComponentDisplayComponentInterface,
  ) {
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

  inputChange($event: Event, component: EgpuResponseCustomComponentDisplayComponentInterface) {
    const { value } = $event.target as HTMLInputElement;
    const inputValidationResult = this.checkInputValidation(value, component);

    this.setValidationState(inputValidationResult, component.id, value);
  }

  checkInputValidation(
    value: string,
    component: EgpuResponseCustomComponentDisplayComponentInterface,
  ): number {
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

  // dateChange($event: any, componentData: EgpuResponseComponentInterface) {
  //   console.log($event, componentData)
  // }

  loadDictionary(
    dictionaryName: string,
    component: EgpuResponseCustomComponentDisplayComponentInterface,
  ) {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.restService.getDictionary(dictionaryName, { pageNum: 0 }).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryName, data, component),
      () => this.loadDictionaryError(dictionaryName),
    );
  }

  loadDictionarySuccess(
    key: string,
    data: DictionaryResponse,
    component: EgpuResponseCustomComponentDisplayComponentInterface,
  ) {
    this.dictionary[key].loading = false;
    this.dictionary[key].paginationLoading = false;
    this.dictionary[key].data = data;
    this.dictionary[key].origin = component;
    this.dictionary[key].list = data.items.map((item) => this.adaptiveData(item));
  }

  loadDictionaryError(key: string) {
    this.dictionary[key].loading = false;
    this.dictionary[key].paginationLoading = false;
    this.dictionary[key].loadError = true;
    this.dictionary[key].loadEnd = false;
  }

  // <------------ tools
  initDictionary(dictionaryName) {
    this.dictionary[dictionaryName] = {
      loading: true,
      loadError: false,
      loadEnd: false,
      paginationLoading: true,
      page: 0,
      data: {} as any,
      list: [],
      origin: {} as any,
      selectedItem: {} as any,
    };
  }

  adaptiveData(item: DictionaryItem): any {
    return {
      id: item.value,
      text: item.title,
      formatted: '',
      // 'hidden': false,
      originalItem: item,
      compare: () => false,
    };
  }

  private initState(component: EgpuResponseCustomComponentDisplayComponentInterface) {
    const { id, value } = component;
    this.state[id] = { valid: false, errorMessage: '', value, component };
  }
}
