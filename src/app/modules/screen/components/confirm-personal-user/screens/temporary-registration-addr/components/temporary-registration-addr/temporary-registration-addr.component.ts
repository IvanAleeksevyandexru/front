import { Component, Input } from '@angular/core';
import { EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface } from '../../../../../../../../interfaces/temporary-registration-addr.interface';

@Component({
  selector: 'app-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
})
export class TemporaryRegistrationAddrComponent {
  date = new Date();
  @Input() data: EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface;

  hintClick(timestamp: number) {
    this.date = new Date(new Date().getTime() + timestamp);
  }
}
