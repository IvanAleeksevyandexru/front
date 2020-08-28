import { Component, Input } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { ConfirmationModalComponent } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.component';
import { InfoScreenBodyComponentModalParams } from './info-screen-body.constant';

@Component({
  selector: 'epgu-constructor-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
})
export class InfoScreenBodyComponent {
  @Input() data: any;

  constructor(private modalService: ModalService) {}

  clickToInnerHTML($event: MouseEvent) {
    const targetElementId = ($event.target as HTMLElement).id;
    const { clarifications = {} } = this.data?.attrs as any;
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
