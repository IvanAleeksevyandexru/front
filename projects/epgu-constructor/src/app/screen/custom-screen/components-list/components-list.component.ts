import { Component, EventEmitter, OnChanges, Output, Input, SimpleChanges } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CustomListDictionaries,
  CustomComponent,
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
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { ConfigService } from '../../../config/config.service';
import { ScreenStore } from '../../screen.types';
import { isEqual } from '../../../shared/constants/uttils';
import { DictionaryForList } from '../../../shared/constants/dictionary';
import { ComponentListFormService } from './services/component-list-form.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})
export class ComponentsListComponent implements OnChanges {
  form: FormArray;
  shownElements: { [key: string]: boolean } = {};

  dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);
  dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;

  @Input() store: ScreenStore;
  @Output() changes: EventEmitter<CustomComponentOutputData>;

  constructor(
    private dictionaryApiService: DictionaryApiService,
    public configService: ConfigService,
    public formService: ComponentListFormService,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnChanges(changes: SimpleChanges) {
    const components: Array<CustomComponent> = changes.store?.currentValue.display.components;
    if (components) {
      this.formService.create(components);

      // Caution! If only emit reference data
      this.loadReferenceData$(components).subscribe((next: Array<CustomListReferenceData>) =>
        this.initDataAfterLoading(next),
      );

      this.formWatcher();
      this.formService.emmitChanges();
    }
  }

  private formWatcher(): void {
    this.formService.watchFormArray$().subscribe(() => this.formService.emmitChanges());
  }

  private initDataAfterLoading(references: Array<CustomListReferenceData>): void {
    references.forEach((reference: CustomListReferenceData) => {
      if (reference.component.type === CustomScreenComponentTypes.DropDown) {
        this.initDropDown(reference as CustomListGenericData<CustomListDropDowns>);
      }

      if (likeDictionary(reference.component.type)) {
        this.initDictionary(reference as CustomListGenericData<DictionaryResponse>);
      }

      setTimeout(() => this.formService.patch(reference.component), 0);

      this.formService.emmitChanges();
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
      data: this.formService.getAdaptiveDropDowns(component.attrs.dictionaryList),
    });
  }

  private screenDataEmitter(next: Array<CustomComponent>, prev?: Array<CustomComponent>): void {
    next.forEach((component: CustomComponent, index: number) => {
      const isCarMarkDic: boolean = component.attrs.dictionaryType === DictionaryForList.markTs;

      if (prev && isCarMarkDic && !isEqual<string>(prev[index]?.value, component.value)) {
        // this.loadModelsTS(component.id);
      }
    });
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
