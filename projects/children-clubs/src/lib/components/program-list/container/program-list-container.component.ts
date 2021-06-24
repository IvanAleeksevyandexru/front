import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ListElement } from '@epgu/epgu-lib';
import { filter, takeUntil } from 'rxjs/operators';
import { ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from '../program-list.service';
import { BaseProgram, Filters, VendorType } from '../../../typings';
import { ProgramFiltersFormComponent } from '../../base/components/program-filters-form/program-filters-form.component';

import { StateService } from '../../../services/state/state.service';

@Component({
  selector: 'children-clubs-program-list',
  templateUrl: './program-list-container.component.html',
  styleUrls: ['./program-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ProgramListContainerComponent implements OnInit {
  fullLoading$: Observable<boolean> = this.listService.fullLoading$;
  filtersCount$$ = new BehaviorSubject<number>(0);
  filtersCount$ = this.filtersCount$$.asObservable();
  data$: Observable<BaseProgram[]> = this.listService.data$;

  initValue = this.stateService.programFilters?.query;

  constructor(
    private modalService: ModalService,
    private listService: ProgramListService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
  ) {}

  fetchItems(): void {
    this.listService.getNextPage();
  }

  search(text: string): void {
    const { programFilters } = this.stateService;
    programFilters.query = text;
    this.stateService.programFilters = programFilters;
  }

  countingFilters(filters: Filters): void {
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
        key !== 'inlernoPayments' &&
        key !== 'pfdoPayments' &&
        key !== 'place' &&
        key !== 'query' &&
        key !== 'focus',
    );
    count += finded.length;

    if ((filters?.place as ListElement)?.text) {
      count += 1;
    }

    const focus = (filters?.focus as ListElement)?.id;
    if (focus && focus !== 'null') {
      count += 1;
    }

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
      .openModal<Filters>(ProgramFiltersFormComponent)
      .pipe(filter((filters) => !!filters))
      .subscribe((programFilters) => {
        this.countingFilters(programFilters);
        this.stateService.programFilters = programFilters;
      });
  }

  ngOnInit(): void {
    const filters = this.stateService.programFilters;
    if (this.stateService.vendor === VendorType.inlearno) {
      delete filters?.pfdoPayments;
    } else {
      delete filters?.inlernoPayments;
    }
    this.stateService.programFilters = filters;
    this.countingFilters(filters);
    this.listService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
