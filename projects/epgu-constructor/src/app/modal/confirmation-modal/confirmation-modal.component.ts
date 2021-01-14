import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ModalService } from '../modal.service';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { ConfirmationModal } from './confirmation-modal.interface';

@Component({
  selector: 'epgu-constructor-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent extends ModalBaseComponent
  implements OnInit, AfterViewInit {
  title?: ConfirmationModal['title'];
  text: ConfirmationModal['text'];
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
  preview?: ConfirmationModal['preview'];

  buttons: ConfirmationModal['buttons'] = [];
  showCrossButton: boolean;
  isShortModal?: ConfirmationModal['isShortModal'];

  constructor(
    private modalService: ModalService,
    private elemRef: ElementRef,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    // By default show cross button if title has been passed
    if (this.showCrossButton === undefined) {
      this.showCrossButton = Boolean(this.title);
    }

    this.eventBusService
      .on('closeModalEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.setElemByIdHandler();
    this.setDefaultCloseAction();
    this.setCustomButtons();
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
      this.buttons.push({
        label: 'Закрыть',
        closeModal: true,
      });
    }
  }

  setCustomButtons(): void {
    this.buttons.forEach(({ handler, closeModal, value }, index) => {
      this.buttons[index].handler = (): void => {
        if (handler) {
          handler();
        }
        if (closeModal) {
          this.closeModal(value);
        }
      };
    });
  }
}
