import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import { Clarifications, ActionType, DTOActionAction } from '@epgu/epgu-constructor-types';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';

import { ScreenService } from '../../../screen/screen.service';
import { ActionService } from '../action/action.service';
import { getHiddenBlock } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';

@Directive({
  selector: '[epgu-constructor-clickable-label]',
})
export class ClickableLabelDirective {
  @Input() public clarifications: Clarifications;
  @Input() public componentId: string;

  constructor(
    private _modalService: ModalService,
    private _screenService: ScreenService,
    private _actionService: ActionService,
    private _elementRef: ElementRef,
    private _currentAnswersService: CurrentAnswersService,
    private _ngZone: NgZone,
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const targetElementActionType = targetElement.getAttribute('data-action-type') as ActionType;
    const targetElementActionValue = targetElement.getAttribute('data-action-value');
    const targetElementActionAction = targetElement.getAttribute('data-action-action');
    const needPrevent = targetElement.hasAttribute('href') && !targetElement.getAttribute('href');

    if (targetElementActionType) {
      event.preventDefault();
      this._runActionInAngularZone(
        targetElementActionType,
        targetElementActionValue,
        targetElementActionAction,
        targetElement,
      );
    } else if (targetElement.id) {
      if (needPrevent) {
        event.preventDefault();
      }
      this._toggleHiddenBlockOrShowModal(this._elementRef.nativeElement, targetElement.id);
    }
  }

  private _runActionInAngularZone(
    targetElementActionType: ActionType,
    targetElementActionValue: string,
    targetElementActionAction: string,
    targetElement: HTMLElement,
  ): void {
    if (NgZone.isInAngularZone()) {
      this._handleAction(
        targetElementActionType,
        targetElementActionValue,
        targetElementActionAction as DTOActionAction,
        targetElement,
      );
    } else {
      this._ngZone.run(() =>
        this._handleAction(
          targetElementActionType,
          targetElementActionValue,
          targetElementActionAction as DTOActionAction,
          targetElement,
        ),
      );
    }
  }

  private _handleAction(
    type: ActionType,
    value?: string,
    action?: DTOActionAction,
    targetElement?: HTMLElement,
  ): void {
    let actionDTO: DTOActionAction;
    if (action) {
      actionDTO = action;
    } else {
      actionDTO =
        type === ActionType.nextStep ? DTOActionAction.getNextStep : DTOActionAction.getPrevStep;
    }

    if (value) {
      this._currentAnswersService.state = value;
    }

    this._actionService.switchAction(
      { label: '', type, action: actionDTO, value },
      this.componentId || this._screenService.component.id,
      targetElement,
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
      componentId: this.componentId,
      showCrossButton: true,
    });
  }
}
