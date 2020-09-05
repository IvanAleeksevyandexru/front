import { Component, Input } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { InfoScreenBodyComponentModalParams } from './info-screen-body.constant';
import { getHiddenBlock } from '../../../../shared/constant/uttils';

@Component({
  selector: 'epgu-constructor-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
})
export class InfoScreenBodyComponent {
  @Input() data: any;

  constructor(private modalService: ModalService) {}

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
      this.startToShowModal(this.data?.attrs?.clarifications, targetElementId);
    }
  }

  private startToShowModal(clarifications = {}, targetElementId: string) {
    const targetElementModalData = clarifications[targetElementId];
    if (targetElementModalData) {
      this.showModal(targetElementModalData);
    }
  }

  showModal(params) {
    this.modalService.openModal(ConfirmationModalComponent, {
      ...InfoScreenBodyComponentModalParams,
      ...params,
    });
  }
}
