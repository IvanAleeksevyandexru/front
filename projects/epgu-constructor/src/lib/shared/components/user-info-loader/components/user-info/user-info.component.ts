import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService, TypeHelperService } from '@epgu/epgu-constructor-ui-kit';
import { IconList, UserInfoType } from './user-info.type';

@Component({
  selector: 'epgu-constructor-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  @Input() set value(user: UserInfoType) {
    if (
      this.typeHelperService.isDefined(user) &&
      this.typeHelperService.isDefined(user.ageType) &&
      this.typeHelperService.isDefined(user.gender) &&
      this.typeHelperService.isDefined(user.name)
    ) {
      this.user.ageType = user.ageType;
      this.user.gender = user.gender;
      this.user.name = user.name;
      this.user.ageText = user.ageText;
      this.iconPath = this.path + this.icons[user.ageType][user.gender];
    }
  }

  path = `${this.config.staticDomainAssetsPath}/assets/icons/svg/`;

  icons: IconList = {
    MATURE: { M: 'male-child.svg', F: 'female-child.svg' },
    YOUNG: { M: 'male-child.svg', F: 'female-child.svg' },
  };
  user = {} as UserInfoType;
  iconPath = '';

  constructor(public config: ConfigService, private typeHelperService: TypeHelperService) {}
}
