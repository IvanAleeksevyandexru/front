import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationModal } from '../confirmation-modal.interface';
import { ConfirmationModalBaseButton } from './confirmation-modal-base.interface';

@Component({
  selector: 'epgu-constructor-confirmation-modal-base',
  templateUrl: './confirmation-modal-base.component.html',
  styleUrls: ['./confirmation-modal-base.component.scss'],
})
export class ConfirmationModalBaseComponent {
  @Input() title?: ConfirmationModal['title'];
  @Input() text: ConfirmationModal['text'];
  @Input() buttons: ConfirmationModalBaseButton[] = [];
  @Input() showCrossButton?: boolean;

  @Output() closeModalChange = new EventEmitter();

  closeModal() {
    this.closeModalChange.emit();
  }
}
