import { Component, Input, EventEmitter, Output } from '@angular/core';
import { EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface } from '../../../../../../../interfaces/temporary-registration-addr.interface';

@Component({
  selector: 'app-temporary-registration-addr-screen',
  templateUrl: './temporary-registration-addr-screen.component.html',
  styleUrls: ['./temporary-registration-addr-screen.component.scss'],
})
export class TemporaryRegistrationAddrScreenComponent {
  @Input() data: EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface;
  @Output() actionSelect = new EventEmitter();

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
