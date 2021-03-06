import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import {
  Clarifications,
  ActionType,
  DTOActionAction,
  ActionAnswerDto,
  ComponentActionDto,
} from '@epgu/epgu-constructor-types';
import {
  ModalService,
  DeviceDetectorService,
  createOpenBrowserEvent,
  JsonHelperService,
  EventBusService,
  BusEventType,
} from '@epgu/epgu-constructor-ui-kit';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { SmuEvent } from '@epgu/ui/models';
import { ScreenService } from '../../../screen/screen.service';
import { ActionService } from '../action/action.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../core/services/html-select/html-select.service';

const excludedTypesForState = [ActionType.deleteSuggest];

@Directive({
  selector: '[epgu-constructor-clickable-label]',
})
export class ClickableLabelDirective {
  @Input() public clarifications: Clarifications;

  @Input() public componentId: string;

  constructor(
    private actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
    private deviceDetectorService: DeviceDetectorService,
    private elementRef: ElementRef,
    private htmlSelectService: HtmlSelectService,
    private jsonHelperService: JsonHelperService,
    private modalService: ModalService,
    private ngZone: NgZone,
    private screenService: ScreenService,
    private smu: SmuEventsService,
    private eventBusService: EventBusService,
  ) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const targetElementActionType = targetElement.getAttribute('data-action-type') as ActionType;
    const targetElementActionValue = targetElement.getAttribute('data-action-value');
    const targetElementActionAction = targetElement.getAttribute('data-action-action');
    const targetElementActionMultipleAnswers = targetElement.getAttribute(
      'data-action-multipleAnswers',
    );
    const targetElementActionAttrs = targetElement.getAttribute('data-action-attrs');
    const needPrevent = targetElement.hasAttribute('href') && !targetElement.getAttribute('href');

    if (
      targetElement.hasAttribute('href') &&
      targetElement.getAttribute('href') &&
      this.deviceDetectorService.isWebView
    ) {
      this.smu.notify(
        createOpenBrowserEvent(targetElement.getAttribute('href'), false) as SmuEvent,
      );
    }

    if (targetElementActionType) {
      event.preventDefault();
      this._runActionInAngularZone(
        targetElementActionType,
        targetElementActionValue,
        targetElementActionAction,
        targetElement,
        targetElementActionMultipleAnswers,
        targetElementActionAttrs,
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
    targetElementActionAttrs?: string,
  ): void {
    if (NgZone.isInAngularZone()) {
      this._handleAction(
        targetElementActionType,
        targetElementActionValue,
        targetElementActionAction as DTOActionAction,
        targetElement,
        targetElementActionMultipleAnswers,
        targetElementActionAttrs,
      );
    } else {
      this.ngZone.run(() =>
        this._handleAction(
          targetElementActionType,
          targetElementActionValue,
          targetElementActionAction as DTOActionAction,
          targetElement,
          targetElementActionMultipleAnswers,
          targetElementActionAttrs,
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
    attrs?: string,
  ): void {
    let actionDTO: DTOActionAction;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let _attrs: ComponentActionDto['attrs'];
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

    if (attrs) {
      _attrs = this.jsonHelperService.tryToParse(attrs);
    }

    if (_attrs?.needToCloseModal) {
      this.eventBusService.emit(BusEventType.CloseModalEventGlobal);
    }

    if (type == ActionType.nextStep) {
      this.eventBusService.emit(BusEventType.GetNextStepWithoutClickedButtonEvent);
    }

    this.actionService.switchAction(
      {
        label: '',
        type,
        action: actionDTO,
        value,
        multipleAnswers: _multipleAnswers,
        attrs: _attrs,
      },
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
      this._showModal(targetElementModalData);
    }
  }

  private _showModal(targetClarification: { text?: string }): void {
    const clarifications = { ...this.clarifications };
    const ConfirmationModalComponent = this.screenService.confirmationModalComponent;

    this.modalService
      .openModal(ConfirmationModalComponent, {
        ...targetClarification,
        clarifications,
        componentId: this.componentId,
      })
      .subscribe((value) => {
        if (value) {
          const id = value as string;
          const newTarget = clarifications[id];

          if (newTarget) this._showModal(newTarget);
        }
      });
  }
}
