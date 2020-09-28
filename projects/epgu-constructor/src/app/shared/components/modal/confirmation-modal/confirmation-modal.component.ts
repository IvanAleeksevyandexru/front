import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ConfirmationModal } from './confirmation-modal.interface';
import { ModalService } from '../../../../services/modal/modal.service';
import { getHiddenBlock } from '../../../constants/uttils';

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
  showCrossButton = false;

  constructor(private modalService: ModalService, private elemRef: ElementRef) {
    super();
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
        elem.addEventListener(event, handler);
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
      this.buttons[index].handler = () => {
        if (handler) {
          handler();
        }
        if (closeModal) {
          this.closeModal(value);
        }
      };
    });
  }

  toggleHiddenBlock($event: MouseEvent, el: HTMLElement): void {
    const targetElementId = ($event.target as HTMLElement).id;
    let hiddenBlock = null;

    if (targetElementId) {
      hiddenBlock = getHiddenBlock(el, targetElementId);
    }
    if (hiddenBlock) {
      hiddenBlock.hidden = !hiddenBlock.hidden;
    }
  }
}
