import { Component, Injector, OnInit } from '@angular/core';
import { CustomComponentRefRelation, DictionaryOptions } from '@epgu/epgu-constructor-types';
import { isUndefined } from 'lodash';
import { Observable, of } from 'rxjs';
import { AbstractControl, FormArray } from '@angular/forms';
import { AbstractComponentListItemComponent } from './abstract-component-list-item.component';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';
import { CustomComponentRef, CustomListDictionary } from '../../components-list.types';
import BaseModel from '../../component-list-resolver/BaseModel';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { UpdateFiltersEvents } from '../../services/components-list-relations/components-list-relations.interface';
import { InviteService } from '../../../../core/services/invite/invite.service';
import { switchMap } from 'rxjs/operators';

@Component({
  template: '',
})
export default abstract class AbstractDictionaryLikeComponent<T extends DictionarySharedAttrs>
  extends AbstractComponentListItemComponent<T>
  implements OnInit {
  protected screenService: ScreenService;
  protected dictionaryService: DictionaryService;
  protected dictionaryToolsService: DictionaryToolsService;
  protected componentsListToolsService: ComponentsListToolsService;
  protected componentsListRelationsService: ComponentsListRelationsService;
  protected inviteService: InviteService;

  constructor(public injector: Injector) {
    super(injector);
    this.screenService = this.injector.get(ScreenService);
    this.inviteService = this.injector.get(InviteService);
    this.dictionaryService = this.injector.get(DictionaryService);
    this.dictionaryToolsService = this.injector.get(DictionaryToolsService);
    this.componentsListToolsService = this.injector.get(ComponentsListToolsService);
    this.componentsListRelationsService = this.injector.get(ComponentsListRelationsService);
  }

  get model(): DictionaryLikeModel {
    return this.control?.value?.model;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadReferenceData$().subscribe(() => {
      window.requestAnimationFrame(() => {
        this.formService.patch(this.model);
        this.formService.emitChanges();
      });
    });
    this.watchForFilters();
  }

  protected loadReferenceData$(): Observable<CustomListDictionary> {
    if (this.attrs.isLoadingNeeded()) {
      const options = this.prepareOptions();
      return this.inviteService.getFilter().pipe(
        switchMap((invite) => {
          return this.getDictionary(this.inviteService.setFilterOptions(invite, options));
        }),
      );
    }
    return of(null);
  }

  protected prepareOptions(): DictionaryOptions {
    const { dictionaryOptions = null, dictionaryFilter = null } = this.attrs;
    const screenStore = this.screenService.getStore();
    const excludedParams = this.attrs?.dictionaryOptions?.excludedParams || [];
    const additionalParams = this.dictionaryToolsService.getAdditionalParams(screenStore, [
      ...(this.attrs?.dictionaryOptions?.additionalParams || []),
    ]);

    const defaultOptions: DictionaryOptions = { pageNum: 0 };
    return {
      ...defaultOptions,
      ...(dictionaryOptions || {}),
      ...(dictionaryFilter
        ? this.dictionaryToolsService.prepareOptions(this.model, screenStore, dictionaryFilter)
        : {}),
      ...{ excludedParams },
      ...{ additionalParams },
    };
  }

  protected getDictionary(options): Observable<CustomListDictionary> {
    return this.model.loadReferenceData$(
      this.dictionaryService.getDictionaries$(
        this.attrs.dictionaryType as string,
        this.model,
        options,
      ),
    );
  }

  protected watchForFilters(): void {
    this.componentsListRelationsService.filters$.subscribe((filters) => {
      const isFilterInited = !isUndefined(filters[this.model.id]);
      const hasFilterReference = filters[this.model.id] !== null;

      if (isFilterInited) {
        const { dictionaryType } = this.attrs;
        const options = this.prepareDictionaryOptions(filters);

        this.model
          .getDictionariesByFilter(
            hasFilterReference,
            this.dictionaryService.getDictionaries$(dictionaryType as string, this.model, options),
          )
          .subscribe(() => {
            this.model.value = this.componentsListToolsService.convertedValue(this.model) as string;
            this.onAfterFilterOnRel(this.model, this.formService.form);
            this.cdr.markForCheck();
            this.formService.emitChanges();
          });
      }
    });
  }

  protected prepareDictionaryOptions(filters: UpdateFiltersEvents): DictionaryOptions {
    const { dictionaryOptions = null } = this.attrs;
    const isHierarchical = !!filters[this.model.id]?.reference?.isHierarchical;
    const hasFilter = !!filters[this.model.id]?.reference?.dictionaryFilter;
    let options: DictionaryOptions = dictionaryOptions || { pageNum: 0 };

    if (isHierarchical) {
      options = {
        ...options,
        parentRefItemValue: filters[this.model.id].value.id as string,
      };
    }

    if (hasFilter) {
      options.filter = this.dictionaryToolsService.getFilterOptions(
        filters[this.model.id].value,
        this.screenService.getStore(),
        filters[this.model.id].reference.dictionaryFilter,
      ).filter;
    }

    return options;
  }

  protected onAfterFilterOnRel(
    dependentComponent: BaseModel<DictionarySharedAttrs>,
    form: FormArray,
  ): void {
    if (!Array.isArray(dependentComponent?.attrs?.ref)) {
      return;
    }
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );

    const relationsToHandle = [
      CustomComponentRefRelation.updateRestLookupOn,
      CustomComponentRefRelation.filterOn,
    ];

    dependentComponent?.attrs?.ref
      .filter((reference) => relationsToHandle.includes(reference.relation))
      .forEach((reference) => {
        const refControl: AbstractControl = form.controls.find(
          (control: AbstractControl) => control.value.id === reference.relatedRel,
        );

        this.handleAfterFilterOnRelation(
          reference,
          refControl,
          dependentControl,
          dependentComponent,
        );
      });
  }

  protected handleAfterFilterOnRelation(
    reference: CustomComponentRef,
    refControl: AbstractControl,
    dependentControl: AbstractControl,
    dependentComponent: BaseModel<DictionarySharedAttrs>,
  ): void {
    if (refControl.touched) {
      if (dependentComponent.isResultEmpty) {
        dependentControl.get('value').patchValue(reference.defaultValue || '');
        dependentControl.get('value').markAsUntouched();
        dependentControl.get('disabled').patchValue(true);
      } else if (dependentControl.get('disabled').value) {
        dependentControl.get('disabled').patchValue(false);
      }
    }
  }
}
