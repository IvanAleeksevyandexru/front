import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  EventBusService,
  ModalBaseComponent,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'children-clubs-content-modal',
  templateUrl: './content-modal.component.html',
  styleUrls: ['./content-modal.component.scss', './../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ContentModalComponent extends ModalBaseComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() modalId: string;

  constructor(
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.eventBusService
      .on(`closeModalEvent_${this.modalId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }
}
