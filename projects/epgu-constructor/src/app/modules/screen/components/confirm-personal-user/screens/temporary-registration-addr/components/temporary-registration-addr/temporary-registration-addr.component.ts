import { Component, Input } from '@angular/core';
import { EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';

@Component({
  selector: 'app-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
})
export class TemporaryRegistrationAddrComponent {
  date = new Date();
  forms = {};
  @Input() data: EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface;

  constructor(public constructorConfigService: ConstructorConfigService) {}

  hintClick(timestamp: number) {
    this.date = new Date(new Date().getTime() + timestamp);
  }
}
