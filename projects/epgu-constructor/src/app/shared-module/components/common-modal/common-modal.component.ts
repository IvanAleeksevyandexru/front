import { Component, TemplateRef } from '@angular/core';
import { ModalBaseComponent } from '../../../shared/components/modal-base/modal-base.component';

@Component({
  selector: 'epgu-constructor-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
})
export class CommonModalComponent extends ModalBaseComponent {
  public modalTemplateRef: TemplateRef<any>;
  public modalTemplateHTML: string;
}
