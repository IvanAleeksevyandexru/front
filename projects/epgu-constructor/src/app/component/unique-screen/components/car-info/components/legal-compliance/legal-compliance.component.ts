import { Component, Input } from '@angular/core';
import { Restriction } from '../../models/car-info.interface';

@Component({
  selector: 'epgu-constructor-legal-compliance',
  templateUrl: './legal-compliance.component.html',
  styleUrls: ['./legal-compliance.component.scss'],
})
export class LegalComplianceComponent {
  @Input() searchingTransportFlag: boolean;
  @Input() restrictionsFlag: boolean;
  @Input() restrictions: Restriction[];
}
