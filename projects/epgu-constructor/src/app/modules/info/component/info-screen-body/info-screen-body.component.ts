import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { ConfirmationModalComponent } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.component';
import { InfoScreenBodyComponentModalParams } from './info-screen-body.constant';

@Component({
  selector: 'epgu-constructor-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
})
export class InfoScreenBodyComponent implements AfterViewInit {
  @Input() data: any;

  constructor(private modalService: ModalService) {}

  ngAfterViewInit(): void {
    const arr = this.data?.attrs?.clarifications || [];
    Object.entries(arr)?.forEach(([id, modalData]) => {
      const link = document.getElementById(id);
      link.addEventListener('click', () => this.showModal(modalData));
    });
  }

  showModal(params) {
    this.modalService.openModal(ConfirmationModalComponent, {
      ...InfoScreenBodyComponentModalParams,
      ...params,
    });
  }
}
