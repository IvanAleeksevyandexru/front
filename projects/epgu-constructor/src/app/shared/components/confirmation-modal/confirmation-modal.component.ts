import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ConfirmationModal } from './confirmation-modal.interface';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'epgu-constructor-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent extends ModalBaseComponent implements AfterViewInit {
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
  buttons: ConfirmationModal['buttons'] = [];

  constructor(private modalService: ModalService, private elemRef: ElementRef) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.clarifications) {
      this.elemEventHandlers = Object.entries(this.clarifications).map(([id, data]) => {
        const clarifications = { ...this.clarifications };
        delete clarifications[id];
        return {
          elemId: id,
          event: 'click',
          handler: () =>
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
        elem.classList.add('cursor-pointer');
        elem.addEventListener(event, handler);
      }
    });

    if (this.showCloseButton) {
      this.buttons.push({
        label: 'Закрыть',
        closeModal: true,
      });
    }

    this.buttons.forEach(({ handler, closeModal }, index) => {
      this.buttons[index].handler = () => {
        if (handler) {
          handler();
        }
        if (closeModal) {
          this.closeModal();
        }
      };
    });
  }
}
