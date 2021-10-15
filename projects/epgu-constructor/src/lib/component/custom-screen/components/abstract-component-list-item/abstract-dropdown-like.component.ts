import { ListItem } from '@epgu/ui/models/dropdown';
import { Observable, of } from 'rxjs';
import { Component, Injector, OnInit } from '@angular/core';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { AbstractComponentListItemComponent } from './abstract-component-list-item.component';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import DropDownLikeModel from '../../component-list-resolver/DropDownLikeModel';

@Component({
  template: '',
})
export default abstract class AbstractDropdownLikeComponent<T extends DictionarySharedAttrs>
  extends AbstractComponentListItemComponent<T>
  implements OnInit {
  protected screenService: ScreenService;
  protected dictionaryToolsService: DictionaryToolsService;
  protected componentsListRelationsService: ComponentsListRelationsService;

  constructor(public injector: Injector) {
    super(injector);
    this.screenService = this.injector.get(ScreenService);
    this.dictionaryToolsService = this.injector.get(DictionaryToolsService);
    this.componentsListRelationsService = this.injector.get(ComponentsListRelationsService);
  }

  get model(): DropDownLikeModel {
    return this.control?.value.model;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadReferenceData$().subscribe(() => {
      setTimeout(() => this.formService.patch(this.model), 0);
      this.formService.emitChanges();
    });
  }

  loadReferenceData$(): Observable<Partial<ListItem>[]> {
    if (this.attrs.isLoadingNeeded()) {
      const { cachedAnswers } = this.screenService;
      return this.model.loadReferenceData$(cachedAnswers);
    }
    return of([]);
  }
}
