import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { getHiddenBlock } from '../../constants/uttils';
import { Clarifications } from '../../../screen/unique-screen/components/file-upload-screen/services/terra-byte-api/terra-byte-api.types';

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
      this.showModal(targetElementModalData, targetElementId);
    }
  }

  showModal(targetClarification, targetElementId) {
    const clarifications = { ...this.clarifications };
    delete clarifications[targetElementId];
    this.modalService.openModal(ConfirmationModalComponent, {
      ...targetClarification,
      clarifications,
    });
  }
}
