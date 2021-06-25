import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { AppNavigationService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../../../../services/state/state.service';
import { GroupListService } from '../../../../services/group-list/group-list.service';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';

@Component({
  selector: 'children-clubs-group-list-container',
  templateUrl: './group-list-container.component.html',
  styleUrls: ['./group-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class GroupListContainerComponent implements OnInit {
  loading$ = this.groupService.loading$;

  filtersCount$ = new BehaviorSubject<number>(0);
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
  ) {}

  openFilter(): void {}

  next(): void {
    this.groupService.next();
  }

  search(text: string): void {
    const { groupFilters } = this.state;
    groupFilters.query = text;
    this.state.groupFilters = groupFilters;
  }

  ngOnInit(): void {
    if (!this.state.selectedProgramUUID) {
      this.appNavigationService.prev();
    }
    this.groupService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
