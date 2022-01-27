import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Group, FindOptionsGroup, VendorType } from '../../models/children-clubs.types';
import BaseListService from '../base-list.service';
import { isEqual } from 'lodash';
import { Injectable, Injector } from '@angular/core';

@Injectable()
export class GroupListService extends BaseListService<Group, FindOptionsGroup> {
  protected refetchSubscribtion = this.stateService.state$.pipe(
    distinctUntilChanged((prev, next) => isEqual(prev?.groupFilters, next?.groupFilters)),
    pluck('groupFilters'),
  );

  protected _args: { uuid: string; vendor: VendorType };

  constructor(protected injector: Injector) {
    super(injector);
  }

  protected fetchData(filters: FindOptionsGroup): Observable<Group[]> {
    const { uuid } = this._args;
    return this.apiService.getGroupList(uuid, filters);
  }

  protected processFilters(filters: FindOptionsGroup): FindOptionsGroup {
    if (this._args.vendor === VendorType.inlearno) {
      delete filters?.pfdoPayments;
    } else {
      delete filters?.inlearnoPayments;
    }
    if (filters?.query?.length === 0) {
      delete filters.query;
    }
    return filters;
  }
}
