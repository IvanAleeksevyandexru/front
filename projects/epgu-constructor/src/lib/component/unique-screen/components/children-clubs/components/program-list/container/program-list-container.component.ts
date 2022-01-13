import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from '../../../services/program-list/program-list.service';
import { ProgramFiltersFormComponent } from '../../base/components/program-filters-form/program-filters-form.component';
import { StateService } from '../../../services/state/state.service';
import {
  BaseProgram,
  Filters,
  GroupFiltersModes,
  VendorType,
} from '../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { countFilters } from '../../../services/helpers/helpers';

@Component({
  selector: 'epgu-constructor-program-list',
  templateUrl: './program-list-container.component.html',
  styleUrls: ['./program-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ProgramListContainerComponent implements OnInit {
  public fullLoading$: Observable<boolean> = this.programListService.fullLoading$;
  public filtersCount$$ = new BehaviorSubject<number>(0);
  public filtersCount$ = this.filtersCount$$.asObservable();
  public data$: Observable<BaseProgram[]> = this.programListService.paginatedData$;
  public initFilter: string;
  private vendor: VendorType = this.screenService.component?.arguments?.vendor as VendorType;

  constructor(
    public programListService: ProgramListService,
    private modalService: ModalService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
    private screenService: ScreenService,
  ) {}

  public ngOnInit(): void {
    this.initFilter = this.stateService.programFilters?.query || '';

    this.stateService.groupFiltersMode =
      this.stateService.groupFiltersMode || GroupFiltersModes.list;
    const filters = this.stateService.programFilters;
    if (this.vendor === VendorType.inlearno) {
      delete filters?.pfdoPayments;
    } else {
      delete filters?.inlearnoPayments;
    }
    this.stateService.programFilters = filters;
    this.programListService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    this.programListService.programFilters$.subscribe((programFilters: Filters) =>
      this.countingFilters(programFilters),
    );
  }

  public nextPage(): void {
    this.programListService.getNextPage();
  }

  public search(text: string): void {
    const { programFilters } = this.stateService;
    programFilters.query = text;
    this.stateService.programFilters = programFilters;
  }

  public countingFilters(filters: Filters): void {
    const count = countFilters(filters, [
      'vendor',
      'nextSchoolYear',
      'inlearnoPayments',
      'pfdoPayments',
      'query',
    ]);

    this.filtersCount$$.next(count);
  }
  public openFilter(): void {
    this.modalService
      .openModal<Filters>(ProgramFiltersFormComponent)
      .pipe(filter((filters) => !!filters))
      .subscribe((programFilters) => {
        this.stateService.programFilters = programFilters;
      });
  }
}
