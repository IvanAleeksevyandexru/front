import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import {
  AppNavigationService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

import { StateService } from '../../../../services/state/state.service';
import { GroupListService } from '../../../../services/group-list/group-list.service';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { FindOptionsGroup, VendorType } from '../../../../typings';
import { GroupFiltersFormComponent } from '../../../base/components/group-filters-form/group-filters-form.component';

@Component({
  selector: 'children-clubs-group-list-container',
  templateUrl: './group-list-container.component.html',
  styleUrls: ['./group-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class GroupListContainerComponent implements OnInit {
  loading$ = this.groupService.loading$;

  filtersCount$$ = new BehaviorSubject<number>(0);
  initValue = this.state.groupFilters.query || '';
  isShowButton$ = this.groupService.isFinish$.pipe(map((status) => !status));
  fullLoading = new BehaviorSubject<boolean>(true);
  fullLoading$ = this.fullLoading.asObservable();
  program$ = this.dictionary.program$.pipe(tap(() => this.fullLoading.next(false)));
  data$ = this.groupService.data$;

  constructor(
    private state: StateService,
    private groupService: GroupListService,
    private dictionary: DictionaryService,
    private appNavigationService: AppNavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private modalService: ModalService,
  ) {}

  next(): void {
    this.groupService.next();
  }

  search(text: string): void {
    const { groupFilters } = this.state;
    groupFilters.query = text;
    this.state.groupFilters = groupFilters;
  }

  countingFilters(filters: FindOptionsGroup): void {
    let count = 0;
    if (!filters) {
      this.filtersCount$$.next(count);
      return;
    }
    const finded = Object.entries(filters).filter(
      ([key, value]) =>
        value !== null &&
        value !== 'null' &&
        value !== 'all' &&
        value !== false &&
        value !== undefined &&
        key !== 'vendor' &&
        key !== 'nextSchoolYear' &&
        key !== 'inlernoPayments' &&
        key !== 'pfdoPayments' &&
        key !== 'query',
    );
    count += finded.length;

    if (filters?.inlernoPayments) {
      count += Object.entries(filters.inlernoPayments).filter((value) => value[1]).length;
    }
    if (filters?.pfdoPayments) {
      count += Object.entries(filters.pfdoPayments).filter((value) => value[1]).length;
    }

    this.filtersCount$$.next(count);
  }

  openFilter(): void {
    this.modalService
      .openModal<FindOptionsGroup>(GroupFiltersFormComponent)
      .pipe(filter((filters) => !!filters))
      .subscribe((groupFilters) => {
        this.countingFilters(groupFilters);
        this.state.groupFilters = groupFilters;
      });
  }

  ngOnInit(): void {
    if (!this.state.selectedProgramUUID) {
      this.appNavigationService.prev();
    }
    const filters = this.state.groupFilters;
    if (this.state.vendor === VendorType.inlearno) {
      delete filters?.pfdoPayments;
    } else {
      delete filters?.inlernoPayments;
    }
    this.state.groupFilters = filters;
    this.countingFilters(filters);
    this.groupService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
