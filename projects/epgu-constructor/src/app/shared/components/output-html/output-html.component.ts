import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';
import { getHiddenBlock } from '../../../../constant/uttils';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss'],
})
export class OutputHtmlComponent implements OnInit {
  @Input() html: string;
  @Input() clarifications: Object;
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  clickToInnerHTML($event: MouseEvent, el: HTMLElement) {
    const targetElementId = ($event.target as HTMLElement).id;
    if (targetElementId) {
      this.toggleHiddenBlockOrShowModal(el, targetElementId);
    }
  }

  private toggleHiddenBlockOrShowModal(el: HTMLElement, targetElementId: string) {
    const hiddenBlock = getHiddenBlock(el, targetElementId);
    if (hiddenBlock) {
      hiddenBlock.hidden = !hiddenBlock.hidden;
    } else {
      this.startToShowModal(this.clarifications, targetElementId);
    }
  }

  private startToShowModal(clarifications = {}, targetElementId: string) {
    const targetElementModalData = clarifications[targetElementId];
    if (targetElementModalData) {
      this.showModal(targetElementModalData);
    }
  }

  showModal(targetClarification) {
    const elemEventHandlers = this.getElemEventHandlersInModal(
      this.clarifications,
      this.modalService,
    );
    this.modalService.openModal(ConfirmationModalComponent, {
      buttons: [{ label: 'Закрыть', closeModal: true }],
      text: targetClarification.text,
      elemEventHandlers,
    });
  }

  getElemEventHandlersInModal(clarifications = {}, modalService: ModalService) {
    return Object.keys(clarifications).map((elemId) => ({
      elemId,
      event: 'click',
      handler: () =>
        modalService.openModal(ConfirmationModalComponent, { text: clarifications[elemId].text }),
    }));
  }
}
