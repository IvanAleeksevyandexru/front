import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ScreenService } from '../../../screen/screen.service';
import { ActionService } from '../action/action.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ActionType, DTOActionAction, } from '../../../form-player/services/form-player-api/form-player-api.types';
import { getHiddenBlock } from '../../constants/uttils';
import { Clarifications } from '../../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';

@Directive({
  selector: '[epgu-constructor-clickable-label]',
})
export class ClickableLabelDirective {
  @Input() public clarifications: Clarifications;

  constructor(
    private _modalService: ModalService,
    private _screenService: ScreenService,
    private _actionService: ActionService,
    private _elementRef: ElementRef,
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const targetElementActionType = targetElement.getAttribute('data-action-type') as ActionType;
    const targetElementActionValue = targetElement.getAttribute('data-action-value');

    if (targetElementActionType) {
      this._handleAction(targetElementActionType, targetElementActionValue);
    } else if (targetElement.id) {
      this._toggleHiddenBlockOrShowModal(this._elementRef.nativeElement, targetElement.id);
    }
  }

  private _handleAction(type: ActionType, value?: string): void {
    const action: DTOActionAction =
      type === ActionType.nextStep ? DTOActionAction.getNextStep : DTOActionAction.getPrevStep;
    this._actionService.switchAction(
      { label: '', type, action, value },
      this._screenService.component.id,
    );
  }

  private _toggleHiddenBlockOrShowModal(el: HTMLElement, targetElementId: string): void {
    const hiddenBlock = getHiddenBlock(el, targetElementId);
    if (hiddenBlock) {
      hiddenBlock.hidden = !hiddenBlock.hidden;
    } else {
      this._startToShowModal(this.clarifications, targetElementId);
    }
  }

  private _startToShowModal(clarifications: Clarifications = {}, targetElementId: string): void {
    const targetElementModalData = clarifications[targetElementId];
    if (targetElementModalData) {
      this._showModal(targetElementModalData, targetElementId);
    }
  }

  private _showModal(targetClarification: { text?: string }, targetElementId: string): void {
    const clarifications = { ...this.clarifications };
    delete clarifications[targetElementId];
    this._modalService.openModal(ConfirmationModalComponent, {
      ...targetClarification,
      clarifications,
      showCrossButton: true,
    });
  }
}
