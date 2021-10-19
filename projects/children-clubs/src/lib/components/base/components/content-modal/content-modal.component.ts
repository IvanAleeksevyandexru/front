import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  ConfigService,
  ConfirmationModalBaseButton,
  EventBusService,
  ModalBaseComponent,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotifierService } from '@epgu/ui/services/notifier';

@Component({
  selector: 'children-clubs-content-modal',
  templateUrl: './content-modal.component.html',
  styleUrls: ['./content-modal.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ContentModalComponent extends ModalBaseComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() text: string;
  @Input() modalId: string;
  @Input() showButtons = true;
  @Input() showCrossButton = true;
  @Input() preview?: ConfirmationModal['preview'];
  @Input() buttons: ConfirmationModalBaseButton[] = [];
  @Input() traceId?: ConfirmationModal['traceId'];

  constructor(
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    public configService: ConfigService,
    private clipboard: Clipboard,
    private notifierService: NotifierService,
    private cdr: ChangeDetectorRef,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`closeModalEvent_${this.modalId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  ngAfterViewInit(): void {
    this.setCustomButtons();
    this.cdr.markForCheck();
  }
  setCustomButtons(): void {
    this.buttons = this.buttons.map((button) => {
      const handler = (): void => {
        if (button.handler) {
          button.handler();
        }
        if (button.closeModal) {
          this.closeModal(button.value);
        }
      };

      return {
        ...button,
        handler,
      };
    });
  }

  copy(traceId: string): void {
    this.clipboard.copy(traceId);
    this.notifierService.success({ message: 'Код ошибки скопирован' });
  }
}
