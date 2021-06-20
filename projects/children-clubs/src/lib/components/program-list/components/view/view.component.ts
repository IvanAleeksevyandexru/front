import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppNavigationService, AppStateQuery } from '@epgu/epgu-constructor-ui-kit';
import { filter, pluck, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Program } from '../../../../typings';

import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { ChildrenClubsState, ChildrenClubsValue } from '../../../../children-clubs.types';

@Component({
  selector: 'children-clubs-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ApiService, useClass: ApiServiceStub }],
})
export class ViewComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  data$: Observable<Program> = this.query.state$.pipe(
    pluck('selectedProgramUUID'),
    filter((uuid) => !!uuid),
    switchMap((uuid: string) => this.api.getProgram(uuid).pipe()),
    tap(() => this.loading.next(false)),
    shareReplay(1),
  );

  constructor(
    private appNavigationService: AppNavigationService,
    private api: ApiService,
    private query: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  next(): void {
    this.appNavigationService.next();
  }
  showPlan(): void {}
  showGoals(): void {}
  showResults(): void {}

  showConditions(): void {}

  ngOnInit(): void {
    if (!this.query.state?.selectedProgramUUID) {
      this.appNavigationService.prev();
    }
  }
}
