import { Injectable } from '@angular/core';
import { ComponentRestUpdates, UpdateFiltersEvents } from './components-list-relations.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CustomComponent,
  CustomListFormGroup,
  CustomListStatusElements,
} from '../../components-list.types';
import { CachedAnswers } from '../../../../screen/screen.types';
import { FormArray } from '@angular/forms';
import { ScreenService } from '../../../../screen/screen.service';

@Injectable()
export class ComponentsListRelationsServiceStub {
  private readonly _filters$: BehaviorSubject<UpdateFiltersEvents> = new BehaviorSubject({});

  private readonly _restUpdates$: BehaviorSubject<ComponentRestUpdates> = new BehaviorSubject({});

  public get filters$(): Observable<UpdateFiltersEvents> {
    return this._filters$.asObservable();
  }

  public get restUpdates$(): Observable<ComponentRestUpdates> {
    return this._restUpdates$.asObservable();
  }

  public calculateVisibility(
    _components: CustomComponent[],
    _cachedAnswers: CachedAnswers,
    _form: FormArray,
  ): CustomListStatusElements {
    return {};
  }

  public processRelations(
    _components: CustomComponent[],
    _component: CustomListFormGroup | CustomComponent,
    _shownElements: CustomListStatusElements,
    _form: FormArray,
    _initInitialValues = false,
    _screenService: ScreenService,
    _componentsGroupIndex?: number,
  ): CustomListStatusElements {
    return this.calculateVisibility(_components, _screenService.cachedAnswers, _form);
  }
}
