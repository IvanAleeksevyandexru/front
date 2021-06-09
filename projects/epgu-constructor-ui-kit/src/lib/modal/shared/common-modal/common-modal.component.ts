import { ChangeDetectionStrategy, Component, Injector, TemplateRef } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';

@Component({
  selector: 'epgu-cf-ui-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonModalComponent extends ModalBaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public modalTemplateRef: TemplateRef<any>;
  public modalTemplateHTML: string;

  constructor(public injector: Injector) {
    super(injector);
  }
}
