import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { ConfirmationModalComponent } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.interface';

@Component({
  selector: 'epgu-constructor-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
})
export class InfoScreenBodyComponent implements AfterViewInit {
  @Input() data: any;

  modalParameters: ConfirmationModal = {
    buttons: [
      {
        label: 'Закрыть',
        closeModal: true,
      },
    ],
  };

  constructor(private modalService: ModalService) {}

  ngAfterViewInit(): void {
    this.data?.attrs?.clarifications?.forEach((modal) => {
      const [id, params] = Object.entries(modal)[0];
      const link = document.getElementById(id);

      link.addEventListener('click', () => this.showModal(params));
      link.style.cursor = 'pointer';
    });
  }

  showModal(params) {
    this.modalService.openModal(ConfirmationModalComponent, { ...this.modalParameters, ...params });
  }
}
