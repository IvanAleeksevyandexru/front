import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MicroAppNavigationService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { tap } from 'rxjs/operators';
import { FinancingType, financingTypes, Program } from '../../../../typings';
import { StateService } from '../../../../services/state/state.service';
import { ContentModalComponent } from '../../../base/components/content-modal/content-modal.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';

@Component({
  selector: 'children-clubs-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  financingType = FinancingType;
  financingTypes = financingTypes;

  data$: Observable<Program> = this.dictionaryService.program$.pipe(
    tap(() => this.loading.next(false)),
  );

  constructor(
    private appNavigationService: MicroAppNavigationService,
    private stateService: StateService,
    private modalService: ModalService,
    private dictionaryService: DictionaryService,
  ) {}

  next(): void {
    this.stateService.clearGroupFilters();
    this.appNavigationService.next();
  }

  prev(): void {
    this.stateService.clearGroupFilters();
    this.appNavigationService.prev();
  }

  openModal(title: string, text: string): void {
    this.modalService
      .openModal(ContentModalComponent, { title, text, modalId: 'info' })
      .subscribe();
  }

  ngOnInit(): void {
    if (!this.stateService.selectedProgramUUID) {
      this.appNavigationService.prev();
    }
  }
}
