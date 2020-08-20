import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import {
  CustomComponentDictionaryState,
  CustomComponentState,
  EgpuResponseCustomComponentDisplayInterface,
  EpguResponseCustomComponentDisplayComponentInterface,
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
      this.data.components.forEach((component) => {
        if (component.type !== CUSTOM_COMPONENT_ITEM_TYPE.LabelSection) {
          this.initState(component.id);
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
    // TODO добавить валидацию и проверку заполнения всех обязательных полей
    const responseData = {};
    const isValid = Object.keys(this.state).every((key) => this.state[key].valid);

    // eslint-disable-next-line no-console
    console.log('isValid', isValid);
    // TODO HARDCODE
    // eslint-disable-next-line no-constant-condition
    if (true) {
      Object.keys(this.state).forEach((key) => {
        responseData[key] = { visited: true, value: JSON.stringify(this.state[key].value || {}) };
      });
      this.nextStepEvent.emit(responseData);
    }
  }

  selectDictionary(
    selectedItem: ListItem,
    component: EpguResponseCustomComponentDisplayComponentInterface,
  ) {
    const dictionaryName = component.attrs?.dictionaryType;
    this.dictionary[dictionaryName].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = selectedItem.originalItem;
    this.state[component.id].valid = true;
  }

  inputChange($event: Event, component: EpguResponseCustomComponentDisplayComponentInterface) {
    this.state[component.id].value = ($event.target as HTMLInputElement).value;
    this.state[component.id].valid = !$event;
  }

  // dateChange($event: any, componentData: EgpuResponseComponentInterface) {
  //   console.log($event, componentData)
  // }

  loadDictionary(
    dictionaryName: string,
    component: EpguResponseCustomComponentDisplayComponentInterface,
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
    component: EpguResponseCustomComponentDisplayComponentInterface,
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

  private initState(componentId: string) {
    this.state[componentId] = { valid: false, errorMessage: '', value: {} };
  }
}
