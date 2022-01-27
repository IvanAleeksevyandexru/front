import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FindOptionsGroup, Group } from '../../models/children-clubs.types';

@Injectable()
export class GroupListServiceStub {
  loading$$ = new BehaviorSubject<boolean>(true);

  loading$ = this.loading$$.asObservable();

  page$$ = new BehaviorSubject<number>(0);

  isFinish$$ = new BehaviorSubject<boolean>(false);

  isFinished$ = this.isFinish$$.asObservable();

  pageSize = 10;

  allData$$ = new BehaviorSubject<Group[]>([]);

  data$$ = new BehaviorSubject<Group[]>([]);

  data$ = this.data$$.asObservable();

  get data(): Group[] {
    return this.data$$.getValue();
  }

  public getGroupList(
    uuid: string,
    groupFilters: FindOptionsGroup,
  ): Observable<{ uuid: string; groupFilters: FindOptionsGroup }> {
    return of({ uuid, groupFilters });
  }

  public reset(): void {}
}
