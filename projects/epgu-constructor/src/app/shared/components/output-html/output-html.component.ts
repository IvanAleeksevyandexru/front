import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { getHiddenBlock } from '../../constants/uttils';
import { Clarifications } from '../../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';
import { NavigationService } from '../../services/navigation/navigation.service';
import { ScreenService } from '../../../screen/screen.service';
import { NavigationPayload } from '../../../form-player/form-player.types';

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
    const targetElementActionType = targetElement.getAttribute('data-action-type');
    const targetElementActionValue = targetElement.getAttribute('data-action-value');

    if (targetElementActionType) {
      this.handleAction(targetElementActionType, targetElementActionValue);
    } else if (targetElement.id) {
      this.toggleHiddenBlockOrShowModal(el, targetElement.id);
    }
  }

  private handleAction(action: string, value?: string): void {
    switch (action) {
      case 'nextStep':
        this.navigationService.next({ payload: this.getComponentState(value) });
        break;
      default:
    }
  }

  private getComponentState(value?: string): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value,
      },
    };
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
