import { Component, TemplateRef } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';

@Component({
  selector: 'epgu-constructor-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
})
export class CommonModalComponent extends ModalBaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public modalTemplateRef: TemplateRef<any>;
  public modalTemplateHTML: string;
}
