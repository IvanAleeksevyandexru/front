import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnInit,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenButton, ConfirmationModal, ActionType } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  ModalService,
  UnsubscribeService,
  ModalBaseComponent,
  ConfirmationModalBaseButton,
  ConfigService,
} from '@epgu/epgu-constructor-ui-kit';
import { NotifierService } from '@epgu/epgu-lib';

@Component({
  selector: 'epgu-constructor-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent extends ModalBaseComponent
  implements OnInit, AfterViewInit {
  text: ConfirmationModal['text'];
  title?: ConfirmationModal['title'];
  traceId?: ConfirmationModal['traceId'];
  showCloseButton: ConfirmationModal['showCloseButton'] = true;
  /** use elemEventHandlers to attach event handler to html element (tag).
   *  E.g. <a id='link'></a>
   *  =======
   *  elemEventHandlers = [ { elemId: 'link', event: 'click', handler: () => console.log('Hello') } ]
   *  =======
   *  <a id='link' (click)='console.log('Hello')'></a>
   *  */
  elemEventHandlers: ConfirmationModal['elemEventHandlers'] = [];
  clarifications?: ConfirmationModal['buttons'];
  componentId?: ConfirmationModal['componentId'];
  preview?: ConfirmationModal['preview'];

  buttons: ConfirmationModalBaseButton[] = [];
  actionButtons: ScreenButton[] = [];
  showCrossButton: boolean;
  isShortModal?: ConfirmationModal['isShortModal'];
  backdropDismiss = true;

  constructor(
    public injector: Injector,
    public configService: ConfigService,
    protected elemRef: ElementRef,
    private modalService: ModalService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private clipboard: Clipboard,
    private notifierService: NotifierService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // By default show cross button if title has been passed
    if (this.showCrossButton === undefined) {
      this.showCrossButton = Boolean(this.title);
    }

    this.eventBusService
      .on(`closeModalEvent_${this.text}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });

    this.eventBusService
      .on('screenButtonClicked')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((button: ScreenButton) => {
        if (button.type === ActionType.deliriumNextStep) {
          this.closeModal();
        }
      });
  }

  ngAfterViewInit(): void {
    this.setElemByIdHandler();
    this.setDefaultCloseAction();
    this.setCustomButtons();
    this.cdr.markForCheck();
  }

  setElemByIdHandler(): void {
    if (this.clarifications) {
      this.elemEventHandlers = Object.entries(this.clarifications).map(([id, data]) => {
        const clarifications = { ...this.clarifications };
        delete clarifications[id];
        return {
          elemId: id,
          event: 'click',
          handler: (): Observable<void> =>
            this.modalService.openModal(ConfirmationModalComponent, {
              ...data,
              clarifications,
            }),
        };
      });
    }

    this.elemEventHandlers.forEach(({ elemId, event, handler }) => {
      const elem = this.elemRef.nativeElement.querySelector(`#${elemId}`);
      if (elem) {
        elem.addEventListener(event, handler.bind(this));
      }
    });
  }

  setDefaultCloseAction(): void {
    if (this.showCloseButton) {
      const defaultCloseLabel = 'Закрыть';

      if (!this.buttons.some((button) => button.label === defaultCloseLabel && button.closeModal)) {
        this.buttons.push({
          label: defaultCloseLabel,
          closeModal: true,
        });
      }
    }
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
