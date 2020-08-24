import { Component, Input } from '@angular/core';
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
})
export class TemporaryRegistrationAddrComponent {
  date = new Date();
  forms: any = {};
  @Input() data: TemporaryRegistrationAddrComponentInterface;

  constructor(public constructorConfigService: ConstructorConfigService) {}

  hintClick(timestamp: number) {
    this.forms.regDate = new Date(new Date().getTime() + timestamp);
  }
}
