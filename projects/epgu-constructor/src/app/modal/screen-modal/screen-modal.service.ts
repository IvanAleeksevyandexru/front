import { Injectable } from '@angular/core';
import { ModalService } from '../modal.service';
import { ScreenModalComponent } from './screen-modal.component';

@Injectable()
export class ScreenModalService {
  constructor(private modalService: ModalService) {
  }

  public openModal(): void {
    this.modalService.openModal(ScreenModalComponent, {});
  }
}
