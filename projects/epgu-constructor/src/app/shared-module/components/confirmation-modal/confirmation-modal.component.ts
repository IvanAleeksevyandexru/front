import { AfterViewInit, Component } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ConfirmationModal } from './confirmation-modal.interface';

@Component({
  selector: 'epgu-constructor-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent extends ModalBaseComponent implements AfterViewInit {
  title?: ConfirmationModal['title'];
  text: ConfirmationModal['text'];
  /** use elemEventHandlers to attach event handler to html element (tag).
   *  E.g. <a id='link'></a>
   *  =======
   *  elemEventHandlers = [ { elemId: 'link', event: 'click', handler: () => console.log('Hello') } ]
   *  =======
   *  <a id='link' (click)='console.log('Hello')'></a>
   *  */
  elemEventHandlers: ConfirmationModal['elemEventHandlers'] = [];
  buttons: ConfirmationModal['buttons'] = [];

  ngAfterViewInit(): void {
    this.elemEventHandlers.forEach(({ elemId, event, handler }) => {
      const elem = document.getElementById(elemId);
      elem.classList.add('cursor-pointer');
      elem.addEventListener(event, handler);
    });

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
