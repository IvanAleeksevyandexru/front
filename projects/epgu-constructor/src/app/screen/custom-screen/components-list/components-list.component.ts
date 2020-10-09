import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import { map, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import {
  CustomComponent,
  CustomComponentDictionaryState,
  CustomComponentDropDownItemList,
  CustomComponentOutputData,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomScreenComponentTypes,
} from '../custom-screen.types';
import {
  DictionaryOptions,
  DictionaryResponse,
} from '../../../services/api/dictionary-api/dictionary-api.types';
import {
  getCalcRelation,
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  isHaveNeededValueForRelation,
  likeDictionary,
} from '../tools/custom-screen-tools';
import { ScreenService } from '../../screen.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { ConfigService } from '../../../config/config.service';
import { ComponentBase, ScreenStore } from '../../screen.types';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../services/validation.service';
import { UniqueScreenComponentTypes } from '../../unique-screen/unique-screen.types';
import { ComponentDto } from '../../../services/api/form-player-api/form-player-api.types';
import { isEqual } from '../../../shared/constants/uttils';
import { DictionaryForList } from '../../../shared/constants/dictionary';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [UnsubscribeService],
})
export class ComponentsListComponent implements OnInit {
  form: FormArray;
  shownElements: { [key: string]: boolean } = {};
  dropDowns: { [key: string]: Array<Partial<ListItem>> } = {};
  dictionaries: { [key: string]: CustomComponentDictionaryState } = {};
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;
  private readonly availableTypesForCheckDependence: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.RadioInput,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.StringInput,
    CustomScreenComponentTypes.DateInput,
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CheckBox,
  ];

  @Output() changes = new EventEmitter<CustomComponentOutputData>();

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    public configService: ConfigService,
    private fb: FormBuilder,
    private unsubscribe$: UnsubscribeService,
    private validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.array([]);
    this.updateScreenData();
  }

  private updateScreenData(): void {
    this.screenService.display$
      .pipe(
        map((): Array<ComponentBase> => this.getComponents(this.screenService.getStore())),
        tap((components: Array<CustomComponent>) => this.rebuildFormAfterDataUpdate(components)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((next) => this.screenDataEmitter(next));
  }

  private formWatcher(): void {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), pairwise(), takeUntil(this.unsubscribe$))
      .subscribe(([prev, next]) => this.screenDataEmitter(next, prev));
  }

  private screenDataEmitter(next: Array<CustomComponent>, prev?: Array<CustomComponent>): void {
    next.forEach((component: CustomComponent, index: number) => {
      const isCarMarkDic: boolean = component.attrs.dictionaryType === DictionaryForList.markTs;

      if (prev && isCarMarkDic && !isEqual<string>(prev[index]?.value, component.value)) {
        this.loadModelsTS(component.id);
      }
      if (this.availableTypesForCheckDependence.includes(component.type)) {
        this.emmitChanges(component);
      } else {
        this.emmitChanges();
      }
    });
  }

  /**
   * Возвращает массив компонентов для отображения
   * @param screen - данные для экрана
   * @private
   */
  private getComponents(screen: ScreenStore): Array<ComponentDto> {
    return screen.display.components[0]?.type === UniqueScreenComponentTypes.repeatableFields
      ? screen.display.components[0].attrs.components
      : screen.display.components;
  }

  /**
   * Пересчитывает форму со свойствами после одновления данных
   * @param components - массив компонентов
   * @private
   */
  private rebuildFormAfterDataUpdate(components: Array<CustomComponent>): void {
    this.form = this.fb.array([]);
    this.formWatcher();
    components.forEach((component: CustomComponent) => {
      let value =
        typeof component.attrs?.defaultValue === 'undefined'
          ? component.value
          : component.attrs?.defaultValue;

      if (isDropDown(component.type)) {
        this.initDropDowns(component);
      }

      if (likeDictionary(component.type)) {
        const { dictionaryType } = component.attrs;
        this.initDictionaries(dictionaryType, component.id);
        this.loadDictionaries(dictionaryType, component, { pageNum: 0 }, value);
      }

      if (component.type === CustomScreenComponentTypes.DateInput && component.value) {
        value = new Date(component.value);
      }

      const group: FormGroup = this.fb.group({
        ...component,
        value: [value, this.validationFn(component)],
      });

      this.shownElements[component.id] = !component.attrs?.ref?.length;
      this.form.push(group);
    });
  }

  /**
   * Метод кастомной валидации контролов
   * @param component
   * @private
   */
  private validationFn(component: CustomComponent): ValidatorFn {
    return this.validationService.customValidator(component);
  }

  private adaptiveDropDown(items: CustomComponentDropDownItemList): Array<Partial<ListItem>> {
    return items.map((item, index) => ({
      id: `${item.code}` || `${item.label}-${index}`,
      text: item.label,
      formatted: '',
      unselectable: !!item.disable,
      originalItem: item,
      compare: () => false,
    }));
  }

  /**
   * Расчет зависимых полей
   * @param component - массив компонентов
   * @private
   */
  private calcDependedFormGroup(component: CustomComponent): void {
    const isComponentDependent = (arr = []): boolean =>
      arr?.some((el) => el.relatedRel === component.id);
    const getDependentComponents = (components): Array<CustomComponent> =>
      components.filter((c: CustomComponent) => isComponentDependent(c.attrs?.ref));

    const components: Array<any> = this.form.getRawValue();
    const dependentComponents: Array<CustomComponent> = getDependentComponents(components);

    dependentComponents.forEach((dependentComponent) => {
      const dependentControl: AbstractControl = this.form.get(
        `${components.findIndex((c) => c.id === dependentComponent.id)}.value`,
      );
      // Проверяем статусы показа и отключённости
      this.shownElements[dependentComponent.id] = isHaveNeededValueForRelation(
        dependentComponent,
        component,
        components,
        CustomComponentRefRelation.displayOn,
      );

      const isDisabled =
        dependentComponent?.attrs?.disabled ||
        isHaveNeededValueForRelation(
          dependentComponent,
          component,
          components,
          CustomComponentRefRelation.disabled,
        );

      if (!this.shownElements[dependentComponent.id]) {
        dependentControl.markAsUntouched();
      }

      const calcRelation = getCalcRelation(dependentComponent);
      if (calcRelation) {
        dependentControl.patchValue(this.calculateValueFromRelation(calcRelation, components), {
          emitEvent: false,
        });
      }

      if (isDisabled) {
        dependentControl.disable({ emitEvent: false });
      } else {
        dependentControl.enable({ emitEvent: false });
      }
    });
  }

  /**
   * Возвращает откалькулируемую функцию по формуле
   * @param formula - формула для расчета
   */
  getCalcFieldValue(formula) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (Math.round(${formula}))`)();
  }

  /**
   * Подсчитывает автовычисляемое значение из формулы, которую передали
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @example {val: '{add16} + {add17} / 100'} => 50 + 150 / 100
   */
  calculateValueFromRelation(itemRef: CustomComponentRef, components: CustomComponent[]) {
    let str = itemRef.val;
    const lettersAnNumberItemRegExp = /\{\w+\}/gm;
    const matches = str.match(lettersAnNumberItemRegExp);
    const componentKeys = Array.isArray(matches) ? [...matches] : [];

    let haveAllValues = true;
    componentKeys.forEach((key: string) => {
      const k = key.replace('{', '').replace('}', '');
      const targetFormKey = `${components.findIndex((c) => c.id === k)}.value`;
      const control = this.form.get(targetFormKey);
      const val = Number(control?.value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(val)) {
        haveAllValues = false;
      } else {
        str = str.replace(key, val.toString());
      }
    });

    // Возвращает например Math.round({add16} + {add17} / 100) => Math.round(50 + 150 / 100)
    return haveAllValues ? this.getCalcFieldValue(str) : '';
  }

  private initDropDowns(component: CustomComponent): void {
    this.dropDowns[component.id] = this.adaptiveDropDown(component.attrs.dictionaryList);
  }

  private initDictionaries(dictionaryType, componentId): void {
    this.dictionaries[dictionaryType + componentId] = getCustomScreenDictionaryFirstState();
  }

  private loadDictionaries(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions = { pageNum: 0 },
    value: any = {},
  ): void {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.dictionaryApiService.getDictionary(dictionaryType, options).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryType, data, component, value),
      () => this.loadDictionaryError(dictionaryType, component.id),
      () => {},
    );
  }

  private loadDictionarySuccess(
    key: string,
    data: DictionaryResponse,
    component: CustomComponent,
    value: any,
  ): void {
    const id = key + component.id;
    this.dictionaries[id].loading = false;
    this.dictionaries[id].paginationLoading = false;
    this.dictionaries[id].data = data;
    this.dictionaries[id].origin = component;
    this.dictionaries[id].list = getNormalizeDataCustomScreenDictionary(data.items, key, component);

    if (Object.keys(value).length) {
      const index = this.form
        .getRawValue()
        .findIndex((c: CustomComponent) => c.id === component.id);

      setTimeout(() => {
        this.form.get(`${index}.value`).patchValue(JSON.parse(value));
      }, 0);
    }
  }

  private loadDictionaryError(key: string, componentId: string): void {
    const id = key + componentId;
    this.dictionaries[id].loading = false;
    this.dictionaries[id].paginationLoading = false;
    this.dictionaries[id].loadError = true;
    this.dictionaries[id].loadEnd = false;
  }

  /**
   * Событие изменения значений в полях
   * @param component - компонент
   * @private
   */
  private emmitChanges(component?: CustomComponent): void {
    if (component) {
      this.calcDependedFormGroup(component);
    }
    const prepareStateForSending = this.getPreparedStateForSending();
    this.changes.emit(prepareStateForSending);
  }

  private getPreparedStateForSending(): any {
    return Object.entries(this.form.getRawValue()).reduce((acc, [key, val]) => {
      const { disabled } = this.form.get([key, 'value']);
      const { value } = val;
      const valid = disabled ? true : this.form.get([key, 'value']).valid;
      if (this.shownElements[val.id]) {
        acc[val.id] = { value, valid, disabled };
      }

      return acc;
    }, {});
  }

  private loadModelsTS(componentId: string): void {
    const indexVehicle: number = this.form.controls.findIndex(
      (control: AbstractControl) => control.value?.id === componentId,
    );

    const options: DictionaryOptions = {
      filter: {
        simple: {
          attributeName: 'Id_Mark',
          condition: 'EQUALS',
          value: {
            asString: `${this.form.get(String(indexVehicle)).value?.value?.id}`,
          },
        },
      },
    };

    const model: AbstractControl = this.form.controls.find(
      (control: AbstractControl) => control.value?.attrs?.dictionaryType === 'MODEL_TS',
    );

    this.loadDictionaries('MODEL_TS', model?.value, options);
  }
}
