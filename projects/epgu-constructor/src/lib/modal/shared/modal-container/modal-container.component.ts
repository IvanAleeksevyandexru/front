import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'epgu-constructor-modal-container',
  styleUrls: ['./modal-container.component.scss'],
  template: '<div id="modal-container"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainerComponent implements OnInit {
  constructor(private modalService: ModalService, private injector: Injector) {}

  ngOnInit(): void {
    this.modalService.registerInjector(this.injector);
  }
}
