import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../../../../services/state/state.service';
import { GroupListService } from '../../../../services/group-list/group-list.service';
import { GroupFiltersFormComponent } from '../../../base/components/group-filters-form/group-filters-form.component';
import {
  FindOptionsGroup,
  Group,
  Program,
  VendorType,
} from '../../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { countFilters } from '../../../../services/helpers/helpers';
import { DictionaryService } from '../../../../../../../../shared/services/dictionary/dictionary.service';

@Component({
  selector: 'epgu-constructor-group-list-container',
  templateUrl: './group-list-container.component.html',
  styleUrls: ['./group-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class GroupListContainerComponent implements OnInit {
  public loading$ = this.groupListService.loading$;
  public titleFilter = 'Введите ФИО педагога, название группы';

  public filtersCount$$ = new BehaviorSubject<number>(0);

  public isShowButton$ = this.groupListService.isFinish$.pipe(map((status) => !status));
  public fullLoading$$ = new BehaviorSubject<boolean>(true);
  public fullLoading$ = this.fullLoading$$.asObservable();
  public program$: Observable<Program>;
  public data$: Observable<Group[]>;
  public initFilter: string = this.stateService.groupFilters.query || '';
  private vendor: VendorType = this.screenService.component?.arguments?.vendor as VendorType;

  constructor(
    private stateService: StateService,
    private groupListService: GroupListService,
    private dictionaryService: DictionaryService,
    private ngUnsubscribe$: UnsubscribeService,
    private modalService: ModalService,
    private screenService: ScreenService,
  ) {}

  public ngOnInit(): void {
    const { uuid, isNextSchoolYear } = this.init();

    this.program$ = this.dictionaryService
      .getProgram(uuid, isNextSchoolYear)
      .pipe(tap(() => this.fullLoading$$.next(false)));
    this.data$ = this.groupListService.data$;
  }

  public getMore(): void {
    this.groupListService.next();
  }

  public search(text: string): void {
    const { groupFilters } = this.stateService;
    groupFilters.query = text;
    this.stateService.groupFilters = groupFilters;
    this.groupListService.reset();
    this.init();
  }

  public openFilter(): void {
    this.modalService
      .openModal<FindOptionsGroup>(GroupFiltersFormComponent)
      .pipe(filter((filters) => !!filters))
      .subscribe((groupFilters) => {
        this.countingFilters(groupFilters);
        this.stateService.groupFilters = groupFilters;
      });
  }

  private init(): { uuid: string; isNextSchoolYear: boolean } {
    const { program, nextSchoolYear } = this.screenService.component?.arguments;
    const uuid = program as string;
    const isNextSchoolYear = nextSchoolYear === 'true' ? true : false;
    const filters = this.stateService.groupFilters;

    if (this.vendor === VendorType.inlearno) {
      delete filters?.pfdoPayments;
    } else {
      delete filters?.inlearnoPayments;
    }
    this.stateService.groupFilters = filters;
    this.countingFilters(filters);

    this.getGroupList(uuid, filters);
    return { uuid, isNextSchoolYear };
  }

  private getGroupList(uuid: string, filters: FindOptionsGroup): void {
    this.groupListService
      .getGroupList(uuid, filters)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe();
  }

  private countingFilters(filters: FindOptionsGroup): void {
    const count = countFilters(filters, [
      'vendor',
      'nextSchoolYear',
      'inlearnoPayments',
      'pfdoPayments',
      'query',
    ]);

    this.filtersCount$$.next(count);
  }
}
