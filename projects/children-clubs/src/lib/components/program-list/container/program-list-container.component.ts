import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from '../../../services/program-list/program-list.service';
import { BaseProgram, Filters, VendorType } from '../../../typings';
import { ProgramFiltersFormComponent } from '../../base/components/program-filters-form/program-filters-form.component';

import { StateService } from '../../../services/state/state.service';
import { GroupFiltersModes } from '../../../children-clubs.types';

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
  data$: Observable<BaseProgram[]> = this.listService.paginatedData$;

  constructor(
    public listService: ProgramListService,
    private modalService: ModalService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
  ) {}

  initValue: () => string = () => this.stateService.programFilters?.query || '';

  nextPage(): void {
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
        value !== false &&
        value !== undefined &&
        key !== 'inlearnoPayments' &&
        key !== 'pfdoPayments' &&
        key !== 'query',
    );
    count += finded.length;

    if (filters?.inlearnoPayments) {
      count += Object.entries(filters.inlearnoPayments).filter((value) => value[1]).length;
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
        this.stateService.programFilters = programFilters;
      });
  }

  ngOnInit(): void {
    this.stateService.groupFiltersMode =
      this.stateService.groupFiltersMode || GroupFiltersModes.list;
    const filters = this.stateService.programFilters;
    if (this.stateService.vendor === VendorType.inlearno) {
      delete filters?.pfdoPayments;
    } else {
      delete filters?.inlearnoPayments;
    }
    this.stateService.programFilters = filters;
    this.listService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    this.listService.programFilters$.subscribe((programFilters: Filters) =>
      this.countingFilters(programFilters),
    );
  }
}
