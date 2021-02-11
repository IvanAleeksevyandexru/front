import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../screen/screen.service';
import { ModalBaseComponent } from '../../shared/modal-base/modal-base.component';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { DropdownListContent } from '../dropdown-list.types';

@Component({
  selector: 'epgu-constructor-dropdown-list-modal',
  templateUrl: './dropdown-list-modal.component.html',
  styleUrls: ['./dropdown-list-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListModalComponent extends ModalBaseComponent implements OnInit {
  data$ = this.screenService.component$.pipe(
    map(
      ({ attrs: { clarifications } }) => (clarifications as DropdownListContent)[this.componentId],
    ),
  );
  componentId: string;

  buttons = [
    {
      label: 'Закрыть',
      handler: (): void => this.closeModal(),
    },
  ];

  constructor(
    public injector: Injector,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.eventBusService
      .on('closeModalEvent_dr_modal')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }
}
