import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { getHiddenBlock } from '../../../shared/constants/uttils';
import { Clarifications } from '../../../shared/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-output-html',
  templateUrl: './output-html.component.html',
  styleUrls: ['./output-html.component.scss'],
})
export class OutputHtmlComponent implements OnInit {
  @Input() html: string;
  @Input() clarifications: Clarifications;
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  clickToInnerHTML($event: MouseEvent, el: HTMLElement): void {
    const targetElementId = ($event.target as HTMLElement).id;
    if (targetElementId) {
      this.toggleHiddenBlockOrShowModal(el, targetElementId);
    }
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

  showModal(targetClarification: { text?: string }, targetElementId: string): void {
    const clarifications = { ...this.clarifications };
    delete clarifications[targetElementId];
    this.modalService.openModal(ConfirmationModalComponent, {
      ...targetClarification,
      clarifications,
      showCrossButton: true,
    });
  }
}
