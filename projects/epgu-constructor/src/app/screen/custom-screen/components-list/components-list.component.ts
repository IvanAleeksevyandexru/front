import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';

import { distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomComponentDictionaryState,
  CustomComponentDropDownStateInterface,
  CustomComponentOutputData,
  CustomComponentState,
  CustomScreenComponentTypes,
} from '../custom-screen.types';
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
} from '../tools/custom-screen-tools';
import { ScreenService } from '../../screen.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { ConfigService } from '../../../config/config.service';
import { ComponentBase, ScreenStore } from '../../screen.types';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnInit {
  form: FormArray;

  private readonly componentType = CustomScreenComponentTypes;
  private availableTypesForCheckDependence: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.RadioInput,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.StringInput,
    CustomScreenComponentTypes.DateInput,
    CustomScreenComponentTypes.AddressInput,
  ];

  // <-- variables
  validationShowOn = ValidationShowOn.IMMEDIATE;
  state: CustomComponentState = {};
  selectedDropDown: { [key: string]: any } = {};
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};
  dropDown: { [key: string]: CustomComponentDropDownStateInterface } = {};

  @Input() components: Array<CustomComponent>;
  @Output() changes = new EventEmitter<CustomComponentOutputData>();

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    private configService: ConfigService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private unsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.array([]);
    this.screenService.screenData$
      .pipe(
        distinctUntilChanged(
          (prev: ScreenStore, next: ScreenStore) => JSON.stringify(prev) === JSON.stringify(next),
        ),
        map((screen: ScreenStore): Array<ComponentBase> => screen.display.components),
        tap((components: Array<CustomComponent>) => {
          this.form = this.fb.array([]);
          components.forEach((component: CustomComponent) => {
            const hasRelatedRef: number = component.attrs?.ref?.length;
            const validators: Array<Validators> = (component.attrs?.validation || [])
              .filter((v: CustomComponentAttrValidation) => v.type === 'RegExp')
              .map((v: CustomComponentAttrValidation) => Validators.pattern(v.value));

            if (component.required) {
              validators.push(Validators.required);
            }

            const group: FormGroup = this.fb.group({
              ...component,
              value: [component.attrs?.defaultValue || component.value, validators],
              isShown: !hasRelatedRef,
            });

            this.form.push(group);
          });
        }),
        switchMap(() =>
          this.form.valueChanges.pipe(
            startWith(this.form.getRawValue()),
            takeUntil(this.unsubscribe$),
          ),
        ),
      )
      .subscribe((components: Array<CustomComponent>) => {
        console.log(this.form);
        components.forEach((component: CustomComponent) => {
          if (this.availableTypesForCheckDependence.includes(component.type)) {
            this.emmitChanges(component);
          } else {
            this.emmitChanges();
          }
        });
      });
  }

  private calcDependedFormGroup(component: CustomComponent) {
    const isLookup: boolean = component.type === CustomScreenComponentTypes.Lookup;
    const components: Array<any> = this.form.getRawValue();
    const dependentComponents: Array<CustomComponent> = components.filter((c: CustomComponent) =>
      c.attrs?.ref?.some((el) => el.relatedRel === component.id),
    );

    dependentComponents.forEach((dependentComponent: CustomComponent) => {
      const index: number = components.findIndex(
        (c: CustomComponent) => c.id === dependentComponent.id,
      );

      const isShown = dependentComponent.attrs.ref.some((item) => {
        const stateRelatedRel = isLookup
          ? components.find((f) => f.id === item.relatedRel)?.value
          : components.find((f) => f.id === item.relatedRel);
        return stateRelatedRel?.value === item.val;
      });

      this.form.get(`${index}.isShown`).patchValue(isShown, { emitEvent: false });
    });

    this.cdr.detectChanges();
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

    if (component?.value) {
      this.selectedDropDown[key] = this.dropDown[key].list.find(
        (list: Partial<ListItem>) => JSON.stringify(list.originalItem) === component.value,
      );
    }
  }

  selectDictionary(selectedItem: ListItem, component: CustomComponent) {
    const dictionaryType = component.attrs?.dictionaryType;
    this.dictionary[dictionaryType + component.id].selectedItem = selectedItem.originalItem;
    this.state[component.id].value = selectedItem.originalItem;
    this.state[component.id].valid = true;
    this.emmitChanges(component);
  }

  selectDropDown($event: any, componentData: CustomComponent) {
    this.state[componentData.id].value = $event.originalItem;
    // this.checkDropDownValidation(componentData);
    this.emmitChanges();
  }

  dropDownValidationOnBlur(componentData: CustomComponent): void {
    this.checkDropDownValidation(componentData);
    this.emmitChanges();
  }

  private checkDropDownValidation(component: CustomComponent): void {
    const text = this.selectedDropDown[component.id]?.text || '';
    const validationResult = CheckInputValidationComponentList(text, component);
    this.setValidationState(validationResult, component.id, text);
  }

  inputChange($event: Event, component: CustomComponent) {
    const { value } = $event.target as HTMLInputElement;
    this.state[component.id].value = value;
    this.checkInputValidation(component, value);
    this.emmitChanges(component);
  }

  inputValidationOnBlur(component: CustomComponent): void {
    const { value } = this.state[component.id];
    this.checkInputValidation(component, value);
  }

  private checkInputValidation(component: CustomComponent, value: string): void {
    const inputValidationResult = CheckInputValidationComponentList(value, component);
    this.setValidationState(inputValidationResult, component.id, value);
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
      this.calcDependedFormGroup(component);
    }
    const prepareStateForSending = this.getPreparedStateForSending();
    this.changes.emit(prepareStateForSending);
  }

  /**
   * Подгатавливаются данные для пробраса на верх.
   * Родительскому компоненту нужны данные компонента и состояние валидности.
   */
  private getPreparedStateForSending() {
    return Object.entries(this.form.getRawValue()).reduce((acc, [key, val]) => {
      const { value, valid = this.form.get([key, 'value']).valid, isShown } = val;
      if (isShown) {
        acc[val.id] = { value, valid };
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
