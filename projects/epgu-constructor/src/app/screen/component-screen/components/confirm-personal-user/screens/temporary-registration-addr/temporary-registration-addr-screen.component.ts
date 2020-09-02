import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../interfaces/temporary-registration-addr.interface';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr-screen',
  templateUrl: './temporary-registration-addr-screen.component.html',
  styleUrls: ['./temporary-registration-addr-screen.component.scss'],
})
export class TemporaryRegistrationAddrScreenComponent {
  @Input() data: TemporaryRegistrationAddrComponentInterface;
  @Input() errors: object;
  @Output() actionSelect = new EventEmitter();

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
