import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';

import { distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomComponentDictionaryState,
  CustomComponentDropDownItemList,
  CustomComponentOutputData,
  CustomScreenComponentTypes,
} from '../custom-screen.types';
import { DictionaryResponse } from '../../../services/api/dictionary-api/dictionary-api.types';
import {
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  likeDictionary,
} from '../tools/custom-screen-tools';
import { ScreenService } from '../../screen.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD, REQUIRED_FIELD } from '../../../shared/constants/helper-texts';
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
    CustomScreenComponentTypes.StringInput,
    CustomScreenComponentTypes.DateInput,
    CustomScreenComponentTypes.AddressInput,
  ];

  private readonly typesWithoutValidation: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];

  @Input() components: Array<CustomComponent>;
  @Output() changes = new EventEmitter<CustomComponentOutputData>();

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    private configService: ConfigService,
    private fb: FormBuilder,
    private unsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.array([]);
    this.formWatcher();
  }

  private formWatcher(): void {
    this.screenService.screenData$
      .pipe(
        distinctUntilChanged(
          (prev: ScreenStore, next: ScreenStore) => JSON.stringify(prev) === JSON.stringify(next),
        ),
        map((screen: ScreenStore): Array<ComponentBase> => screen.display.components),
        tap((components: Array<CustomComponent>) => this.rebuildFormAfterDataUpdate(components)),
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

  private rebuildFormAfterDataUpdate(components: Array<CustomComponent>): void {
    this.form = this.fb.array([]);
    components.forEach((component: CustomComponent) => {
      if (isDropDown(component.type)) {
        this.initDropDowns(component);
      }

      if (likeDictionary(component.type)) {
        const { dictionaryType } = component.attrs;
        this.initDictionaries(dictionaryType, component.id);
        this.loadDictionaries(dictionaryType, component);
      }

      const group: FormGroup = this.fb.group({
        ...component,
        value: [component.attrs?.defaultValue || component.value, this.validationFn(component)],
      });

      this.shownElements[component.id] = !component.attrs?.ref?.length;
      this.form.push(group);
    });
  }

  private validationFn(component: CustomComponent): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      if (component.required && !control.value) {
        return this.validationErrorMsg(REQUIRED_FIELD);
      }

      const err = component.attrs?.validation?.find(
        (validator: CustomComponentAttrValidation) =>
          validator.type === 'RegExp' && !new RegExp(validator.value).test(control.value),
      );

      return err ? this.validationErrorMsg(err.errorMsg) : null;
    };
  }

  private validationErrorMsg(error: string): ValidationErrors {
    return { msg: error };
  }

  private adaptiveDropDown(items: CustomComponentDropDownItemList): Array<Partial<ListItem>> {
    return items.map((item, index) => ({
      id: `${item.label}-${index}`,
      text: item.label,
      formatted: '',
      unselectable: !!item.disable,
      originalItem: item,
      compare: () => false,
    }));
  }

  private calcDependedFormGroup(component: CustomComponent): void {
    const isLookup: boolean = component.type === CustomScreenComponentTypes.Lookup;
    const components: Array<any> = this.form.getRawValue();
    const dependentComponents: Array<CustomComponent> = components.filter((c: CustomComponent) =>
      c.attrs?.ref?.some((el) => el.relatedRel === component.id),
    );

    dependentComponents.forEach((dependentComponent: CustomComponent) => {
      const isShown = dependentComponent.attrs.ref.some((item) => {
        const stateRelatedRel = isLookup
          ? components.find((f) => f.id === item.relatedRel)?.value
          : components.find((f) => f.id === item.relatedRel);
        return stateRelatedRel?.value === item.val;
      });

      if (!isShown) {
        this.form
          .get(`${components.findIndex((c) => c.id === dependentComponent.id)}.value`)
          .markAsUntouched();
      }
      this.shownElements[dependentComponent.id] = isShown;
    });
  }

  private initDropDowns(component: CustomComponent): void {
    this.dropDowns[component.id] = this.adaptiveDropDown(component.attrs.dictionaryList);
  }

  private initDictionaries(dictionaryType, componentId): void {
    this.dictionaries[dictionaryType + componentId] = getCustomScreenDictionaryFirstState();
  }

  private loadDictionaries(dictionaryType: string, component: CustomComponent): void {
    // TODO добавить обработку loader(-а) для словарей и ошибок;
    this.dictionaryApiService.getDictionary(dictionaryType, { pageNum: 0 }).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryType, data, component),
      () => this.loadDictionaryError(dictionaryType, component.id),
      () => {},
    );
  }

  private loadDictionarySuccess(
    key: string,
    data: DictionaryResponse,
    component: CustomComponent,
  ): void {
    const id = key + component.id;
    this.dictionaries[id].loading = false;
    this.dictionaries[id].paginationLoading = false;
    this.dictionaries[id].data = data;
    this.dictionaries[id].origin = component;
    this.dictionaries[id].list = getNormalizeDataCustomScreenDictionary(data.items, key, component);
  }

  dateChange($event: string, component: CustomComponent) {
    this.emmitChanges(component);
  }

  private loadDictionaryError(key: string, componentId: string): void {
    const id = key + componentId;
    this.dictionaries[id].loading = false;
    this.dictionaries[id].paginationLoading = false;
    this.dictionaries[id].loadError = true;
    this.dictionaries[id].loadEnd = false;
  }

  private emmitChanges(component?: CustomComponent): void {
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
  private getPreparedStateForSending(): any {
    return Object.entries(this.form.getRawValue()).reduce((acc, [key, val]) => {
      const { value, valid = this.form.get([key, 'value']).valid } = val;
      if (this.shownElements[val.id]) {
        acc[val.id] = { value, valid };
      }
      return acc;
    }, {});
  }
}
