import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconList, UserInfoType } from './user-info.type';

import { ConfigService } from '../../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  @Input() value: UserInfoType;

  path = `${this.config.staticDomainAssetsPath}/assets/icons/svg/`;

  icons: IconList = {
    MATURE: { M: 'male-child.svg', F: 'female-child.svg' },
    YOUNG: { M: 'male-child.svg', F: 'female-child.svg' },
  };

  constructor(public config: ConfigService) {}
}
