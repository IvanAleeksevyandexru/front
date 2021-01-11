import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ComponentBase } from '../../../../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportComponent {
  @Input() data: ComponentBase;
}
