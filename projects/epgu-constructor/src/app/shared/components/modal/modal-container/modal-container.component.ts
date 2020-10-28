import { Component, Injector, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'epgu-constructor-modal-container',
  styleUrls: ['./modal-container.component.scss'],
  template: '<div id="modal-container"></div>',
})
export class ModalContainerComponent implements OnInit {
  constructor(private modalService: ModalService, private injector: Injector) {}

  public ngOnInit() {
    this.modalService.registerInjector(this.injector);
  }
}
