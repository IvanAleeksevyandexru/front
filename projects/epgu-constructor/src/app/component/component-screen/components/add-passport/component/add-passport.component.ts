import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ComponentAttrsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportComponent {
  @Input() data: ComponentAttrsDto;
}
