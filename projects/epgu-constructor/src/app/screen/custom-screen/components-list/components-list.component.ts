import {
  Component,
  EventEmitter,
  OnChanges,
  Output,
  Input,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CustomListDictionaries,
  CustomComponent,
  CustomComponentDropDownItemList,
  CustomComponentOutputData,
  CustomScreenComponentTypes,
  CustomListReferenceData,
  CustomListGenericData,
  CustomListDropDowns,
} from '../custom-screen.types';
import {
  DictionaryOptions,
  DictionaryResponse,
} from '../../../services/api/dictionary-api/dictionary-api.types';
import {
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  likeDictionary,
} from '../tools/custom-screen-tools';
import { ScreenService } from '../../screen.service';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { ConfigService } from '../../../config/config.service';
import { ScreenStore } from '../../screen.types';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { isEqual } from '../../../shared/constants/uttils';
import { DictionaryForList } from '../../../shared/constants/dictionary';
import { AddressHelperService, DadataSuggestionsAddressForLookup } from './address-helper.service';
import { ComponentListFormService } from './services/component-list-form.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [UnsubscribeService, ComponentListFormService],
})
export class ComponentsListComponent implements OnChanges, OnInit {
  form: FormArray;
  shownElements: { [key: string]: boolean } = {};

  dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);
  dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

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
    CustomScreenComponentTypes.CityInput,
  ];

  @Input() store: ScreenStore;
  @Output() changes = new EventEmitter<CustomComponentOutputData>();

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    public configService: ConfigService,
    public addressHelperService: AddressHelperService,
    public formService: ComponentListFormService,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const components: Array<CustomComponent> = changes.store?.currentValue.display.components;
    if (components) {
      this.loadReferenceData$(components).subscribe((next: Array<CustomListReferenceData>) =>
        this.initDataAfterLoading(next),
      );
      this.formService.create(components);
      this.formService.form.valueChanges.subscribe(() => {
        this.emmitChanges();
      });

      this.emmitChanges();
    }
  }

  private initDataAfterLoading(references: Array<CustomListReferenceData>): void {
    references.forEach((reference: CustomListReferenceData) => {
      if (reference.component.type === CustomScreenComponentTypes.DropDown) {
        this.initDropDown(reference as CustomListGenericData<CustomListDropDowns>);
      }

      if (likeDictionary(reference.component.type)) {
        this.initDictionary(reference as CustomListGenericData<DictionaryResponse>);
      }

      console.log(reference);
    });
  }

  private initDictionary(reference: CustomListGenericData<DictionaryResponse>): void {
    const dictionaries: CustomListDictionaries = this.dictionaries$.getValue();
    const { dictionaryType } = reference.component.attrs;
    const id = dictionaryType + reference.component.id;

    dictionaries[id] = getCustomScreenDictionaryFirstState();
    dictionaries[id].loading = false;
    dictionaries[id].paginationLoading = false;
    dictionaries[id].data = reference.data;
    dictionaries[id].origin = reference.component;
    dictionaries[id].list = getNormalizeDataCustomScreenDictionary(
      reference.data.items,
      dictionaryType,
      reference.component,
    );

    this.dictionaries$.next(dictionaries);
  }

  private initDropDown(reference: CustomListGenericData<CustomListDropDowns>): void {
    const dropDowns: CustomListDropDowns = this.dropDowns$.getValue();
    dropDowns[reference.component.id] = reference.data;

    this.dropDowns$.next(dropDowns);
  }

  private loadReferenceData$(components: Array<CustomComponent>): Observable<any> {
    const data: Array<Observable<any>> = [];
    components.forEach((component: CustomComponent) => {
      if (isDropDown(component.type)) {
        data.push(this.getDropDowns$(component));
      }

      if (likeDictionary(component.type)) {
        const { dictionaryType } = component.attrs;
        data.push(this.getDictionaries$(dictionaryType, component, { pageNum: 0 }));
      }
    });

    return forkJoin(data);
  }

  private getDictionaries$(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return this.dictionaryApiService.getDictionary(dictionaryType, options).pipe(
      map((dictionary: DictionaryResponse) => ({
        component,
        data: { ...dictionary },
      })),
    );
  }

  private getDropDowns$(
    component: CustomComponent,
  ): Observable<CustomListGenericData<CustomListDropDowns>> {
    return of({
      component,
      data: this.adaptiveDropDown(component.attrs.dictionaryList),
    });
  }

  private screenDataEmitter(next: Array<CustomComponent>, prev?: Array<CustomComponent>): void {
    next.forEach((component: CustomComponent, index: number) => {
      const isCarMarkDic: boolean = component.attrs.dictionaryType === DictionaryForList.markTs;

      if (prev && isCarMarkDic && !isEqual<string>(prev[index]?.value, component.value)) {
        // this.loadModelsTS(component.id);
      }
      if (this.availableTypesForCheckDependence.includes(component.type)) {
        if (prev && !isEqual<string>(prev[index]?.value, component.value)) {
          this.emmitChanges(component);
        }
      } else {
        this.emmitChanges();
      }
    });
  }

  private adaptiveDropDown(items: CustomComponentDropDownItemList): Array<Partial<ListItem>> {
    return items.map((item, index) => ({
      id: item.code || `${item.label}-${index}`,
      text: item.label,
      formatted: '',
      unselectable: !!item.disable,
      originalItem: item,
      compare: () => false,
    }));
  }

  private async emmitChanges(component?: CustomComponent) {
    if (component?.value && component.type === this.componentType.CityInput) {
      await this.addressHelperService.normalizeAddress(
        (component.value as unknown) as DadataSuggestionsAddressForLookup,
      );
    }
    const prepareStateForSending = this.getPreparedStateForSending();
    console.log('emitChanges', prepareStateForSending);
    this.changes.emit(prepareStateForSending);
  }

  private getPreparedStateForSending(): any {
    const { form } = this.formService;
    return Object.entries(form.getRawValue()).reduce((acc, [key, val]) => {
      const { disabled, valid } = this.formService.form.get([key, 'value']);
      const { value } = val;
      const isValid = disabled || valid;
      if (this.formService.shownElements[val.id]) {
        acc[val.id] = { value, isValid, disabled };
      }

      return acc;
    }, {});
  }

  // private loadModelsTS(componentId: string): void {
  //   const indexVehicle: number = this.form.controls.findIndex(
  //     (control: AbstractControl) => control.value?.id === componentId,
  //   );
  //
  //   const options: DictionaryOptions = {
  //     filter: {
  //       simple: {
  //         attributeName: 'Id_Mark',
  //         condition: 'EQUALS',
  //         value: {
  //           asString: `${this.form.get(String(indexVehicle)).value?.value?.id}`,
  //         },
  //       },
  //     },
  //   };
  //
  //   const model: AbstractControl = this.form.controls.find(
  //     (control: AbstractControl) => control.value?.attrs?.dictionaryType === 'MODEL_TS',
  //   );
  //
  //   this.loadDictionaries('MODEL_TS', model?.value, options);
  // }
}
