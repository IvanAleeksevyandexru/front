import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { getHiddenBlock } from '../../constants/uttils';
import { Clarifications } from '../../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import {
  ActionType,
  DTOActionAction,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ActionService } from '../../directives/action/action.service';

@Component({
  selector: 'epgu-constructor-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputHtmlComponent {
  @Input() html: string;
  @Input() clarifications: Clarifications;

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
    private screenService: ScreenService,
    private actionService: ActionService,
  ) {}

  showModal(targetClarification: { text?: string }, targetElementId: string): void {
    const clarifications = { ...this.clarifications };
    delete clarifications[targetElementId];
    this.modalService.openModal(ConfirmationModalComponent, {
      ...targetClarification,
      clarifications,
      showCrossButton: true,
    });
  }

  clickToInnerHTML($event: MouseEvent, el: HTMLElement): void {
    const targetElement = $event.target as HTMLElement;
    const targetElementActionType = targetElement.getAttribute('data-action-type') as ActionType;
    const targetElementActionValue = targetElement.getAttribute('data-action-value');

    if (targetElementActionType) {
      this.handleAction(targetElementActionType, targetElementActionValue);
    } else if (targetElement.id) {
      this.toggleHiddenBlockOrShowModal(el, targetElement.id);
    }
  }

  private handleAction(type: ActionType, value?: string): void {
    const action: DTOActionAction =
      type === ActionType.nextStep ? DTOActionAction.getNextStep : DTOActionAction.getPrevStep;
    this.actionService.switchAction(
      { label: '', type, action, value },
      this.screenService.component.id,
    );
  }

  private toggleHiddenBlockOrShowModal(el: HTMLElement, targetElementId: string): void {
    const hiddenBlock = getHiddenBlock(el, targetElementId);
    if (hiddenBlock) {
      hiddenBlock.hidden = !hiddenBlock.hidden;
    } else {
      this.startToShowModal(this.clarifications, targetElementId);
    }
  }

  private startToShowModal(clarifications: Clarifications = {}, targetElementId: string): void {
    const targetElementModalData = clarifications[targetElementId];
    if (targetElementModalData) {
      this.showModal(targetElementModalData, targetElementId);
    }
  }
}
