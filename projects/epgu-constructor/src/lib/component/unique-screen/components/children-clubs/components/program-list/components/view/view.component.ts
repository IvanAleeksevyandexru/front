import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { tap } from 'rxjs/operators';
import { DictionaryCcService } from '../../../../services/dictionary/dictionary.service';
import { financingTypes, Program } from '../../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import {
  NEXT_STEP_ACTION,
  PREV_STEP_ACTION,
} from '../../../../../../../../shared/constants/actions';
import { ActionService } from '../../../../../../../../shared/directives/action/action.service';
import { ConfirmationModalComponent } from '../../../../../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-cc-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit {
  public loading = new BehaviorSubject<boolean>(true);
  public loading$ = this.loading.asObservable();

  public financingTypes = financingTypes;

  public data$: Observable<Program>;

  constructor(
    public config: ConfigService,
    private actionService: ActionService,
    private modalService: ModalService,
    private dictionaryService: DictionaryCcService,
    private screenService: ScreenService,
  ) {}

  public ngOnInit(): void {
    const programUuid = this.screenService.component?.arguments?.program as string;
    const isNextSchoolYear = this.screenService.component?.arguments?.nextSchoolYear === 'true';
    this.data$ = this.dictionaryService
      .getProgram(programUuid, isNextSchoolYear)
      .pipe(tap(() => this.loading.next(false)));
  }

  public next(): void {
    this.actionService.switchAction(NEXT_STEP_ACTION);
  }

  public prev(): void {
    this.actionService.switchAction(PREV_STEP_ACTION);
  }

  public openModal(title: string, text: string): void {
    this.modalService
      .openModal(ConfirmationModalComponent, { title, text, subModal: true })
      .subscribe();
  }
}
