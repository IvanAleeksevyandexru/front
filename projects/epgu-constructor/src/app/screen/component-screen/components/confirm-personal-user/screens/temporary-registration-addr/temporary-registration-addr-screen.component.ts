import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemporaryRegistrationComponent } from './temporary-registration-addr-screen.types';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr-screen',
  templateUrl: './temporary-registration-addr-screen.component.html',
  styleUrls: ['./temporary-registration-addr-screen.component.scss'],
})
export class TemporaryRegistrationAddrScreenComponent {
  @Input() data: TemporaryRegistrationComponent;
  @Input() errors: object;
  @Output() actionSelect = new EventEmitter();

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
