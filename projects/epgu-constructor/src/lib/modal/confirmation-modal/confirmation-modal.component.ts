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
import { takeUntil } from 'rxjs/operators';
import {
  ScreenButton,
  ConfirmationModal,
  ActionType,
  Clarifications,
  LongButtonColor,
  CloseHandlerCases,
} from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  UnsubscribeService,
  ModalBaseComponent,
  ConfirmationModalBaseButton,
  ConfigService,
  ConfirmationModalAnswerButton,
  BusEventType,
  LocationService,
} from '@epgu/epgu-constructor-ui-kit';
import { NotifierService } from '@epgu/ui/services/notifier';
import { NavigationService } from '../../core/services/navigation/navigation.service';

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
  clarifications?: Clarifications;
  componentId?: ConfirmationModal['componentId'];
  preview?: ConfirmationModal['preview'];

  answerButtons: ConfirmationModalAnswerButton[] = [];
  buttons: ConfirmationModalBaseButton[] = [];
  actionButtons: ScreenButton[] = [];
  showCrossButton: boolean;
  isShortModal?: ConfirmationModal['isShortModal'];
  closeHandlerCase: ConfirmationModal['closeHandlerCase'];
  backdropDismiss = true;
  blueColor = LongButtonColor.BLUE;

  constructor(
    public injector: Injector,
    public configService: ConfigService,
    protected elemRef: ElementRef,
    private locationService: LocationService,
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
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
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`closeModalEvent_${this.text}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });

    this.eventBusService
      .on(BusEventType.ScreenButtonClicked)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((button: ScreenButton) => {
        if (button.type === ActionType.deliriumNextStep) {
          this.closeModal();
        }
      });
  }

  ngAfterViewInit(): void {
    this.setDefaultCloseAction();
    this.setCustomButtons();
    this.cdr.markForCheck();
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

  onAnswerSelect(value: string): void {
    this.closeModal(value);
  }

  copy(traceId: string): void {
    this.clipboard.copy(traceId);
    this.notifierService.success({ message: 'Код ошибки скопирован' });
  }

  closeModal(value?: unknown): void {
    super.closeModal(value);

    switch (this.closeHandlerCase) {
      case CloseHandlerCases.PREV_STEP:
        this.navigationService.prev();
        break;
      case CloseHandlerCases.REDIRECT_TO_LK:
        this.navigationService.redirectToLK();
        break;
      case CloseHandlerCases.RELOAD:
        this.locationService.reload();
        break;
      default:
        this.navigationService.prev();
        break;
    }
  }
}
