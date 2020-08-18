import { Component, Input, EventEmitter, Output } from '@angular/core';
import { EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface } from '../../../../../../../interfaces/temporary-registration-addr.interface';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'app-temporary-registration-addr-screen',
  templateUrl: './temporary-registration-addr-screen.component.html',
  styleUrls: ['./temporary-registration-addr-screen.component.scss'],
})
export class TemporaryRegistrationAddrScreenComponent {
  @Input() data: EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface;
  @Output() actionSelect = new EventEmitter();

  constructor(private screenComponentService: ScreenComponentService) {}

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
