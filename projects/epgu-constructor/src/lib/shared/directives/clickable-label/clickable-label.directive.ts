import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import { Clarifications, ActionType, DTOActionAction, ActionAnswerDto } from '@epgu/epgu-constructor-types';
import {
  ModalService,
  DeviceDetectorService,
  createOpenBrowserEvent,
  HtmlSelectService
} from '@epgu/epgu-constructor-ui-kit';
import { SmuEventsService } from '@epgu/epgu-lib';

import { ScreenService } from '../../../screen/screen.service';
import { ActionService } from '../action/action.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';

const excludedTypesForState = [ActionType.deleteSuggest];

@Directive({
  selector: '[epgu-constructor-clickable-label]',
})
export class ClickableLabelDirective {
  @Input() public clarifications: Clarifications;
  @Input() public componentId: string;

  constructor(
    private modalService: ModalService,
    private screenService: ScreenService,
    private actionService: ActionService,
    private elementRef: ElementRef,
    private currentAnswersService: CurrentAnswersService,
    private ngZone: NgZone,
    private smu: SmuEventsService,
    private deviceDetectorService: DeviceDetectorService,
    private htmlSelectService: HtmlSelectService,
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const targetElementActionType = targetElement.getAttribute('data-action-type') as ActionType;
    const targetElementActionValue = targetElement.getAttribute('data-action-value');
    const targetElementActionAction = targetElement.getAttribute('data-action-action');
    const targetElementActionMultipleAnswers = targetElement.getAttribute('data-action-multipleAnswers');
    const needPrevent = targetElement.hasAttribute('href') && !targetElement.getAttribute('href');

    if (targetElement.hasAttribute('href') && targetElement.getAttribute('href') && this.deviceDetectorService.isWebView) {
      this.smu.notify(createOpenBrowserEvent(targetElement.getAttribute('href'), false));
    }

    if (targetElementActionType) {
      event.preventDefault();
      this._runActionInAngularZone(
        targetElementActionType,
        targetElementActionValue,
        targetElementActionAction,
        targetElement,
        targetElementActionMultipleAnswers,
      );
    } else if (targetElement.id) {
      if (needPrevent) {
        event.preventDefault();
      }
      this._toggleHiddenBlockOrShowModal(this.elementRef.nativeElement, targetElement.id);
    }
  }

  private _runActionInAngularZone(
    targetElementActionType: ActionType,
    targetElementActionValue: string,
    targetElementActionAction: string,
    targetElement: HTMLElement,
    targetElementActionMultipleAnswers?: string,
  ): void {
    if (NgZone.isInAngularZone()) {
      this._handleAction(
        targetElementActionType,
        targetElementActionValue,
        targetElementActionAction as DTOActionAction,
        targetElement,
        targetElementActionMultipleAnswers,
      );
    } else {
      this.ngZone.run(() =>
        this._handleAction(
          targetElementActionType,
          targetElementActionValue,
          targetElementActionAction as DTOActionAction,
          targetElement,
          targetElementActionMultipleAnswers,
        ),
      );
    }
  }

  private _handleAction(
    type: ActionType,
    value?: string,
    action?: DTOActionAction,
    targetElement?: HTMLElement,
    multipleAnswers?: string,
  ): void {
    let actionDTO: DTOActionAction;
    const _multipleAnswers = (multipleAnswers as unknown) as ActionAnswerDto[];
    if (action) {
      actionDTO = action;
    } else {
      actionDTO =
        type === ActionType.nextStep ? DTOActionAction.getNextStep : DTOActionAction.getPrevStep;
    }

    if (value && !excludedTypesForState.includes(type)) {
      this.currentAnswersService.state = value;
    }

    this.actionService.switchAction(
      { label: '', type, action: actionDTO, value, multipleAnswers: _multipleAnswers },
      this.componentId || this.screenService.component.id,
      targetElement,
    );
  }

  private _toggleHiddenBlockOrShowModal(el: HTMLElement, targetElementId: string): void {
    const hiddenBlock = this.htmlSelectService.getHiddenBlock(el, targetElementId);
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
    this.modalService.openModal(ConfirmationModalComponent, {
      ...targetClarification,
      clarifications,
      componentId: this.componentId,
      showCrossButton: true,
    });
  }
}
