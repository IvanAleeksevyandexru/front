import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from '../program-list.service';
import { BaseProgram } from '../../../typings';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'children-clubs-program-list',
  templateUrl: './program-list-container.component.html',
  styleUrls: ['./program-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ProgramListContainerComponent implements OnInit {
  fullLoading$: Observable<boolean> = this.listService.fullLoading$;

  data$: Observable<BaseProgram[]> = this.listService.data$;

  constructor(
    private listService: ProgramListService,
    private api: ApiService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  fetchItems(): void {
    this.listService.getNextPage();
  }

  ngOnInit(): void {
    this.listService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
