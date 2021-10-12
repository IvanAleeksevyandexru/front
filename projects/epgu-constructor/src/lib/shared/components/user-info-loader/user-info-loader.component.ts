import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ComponentDto,
  CycledInfo,
  UserInfoComponentTypes,
  UserInfo,
  InfoComponentDto,
} from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../screen/screen.service';
import { ComponentValue } from '../../../screen/screen-content';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

@Component({
  selector: 'epgu-constructor-user-info-loader',
  templateUrl: './user-info-loader.component.html',
  styleUrls: ['./user-info-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoLoaderComponent {
  components$: Observable<
    [ComponentDto, ComponentValue][]
  > = this.screenService.infoComponents$.pipe(
    map((components) => {
      return components?.map((component: InfoComponentDto) => {
        const value = this.jsonHelperService.tryToParse(component.value);
        switch (component.type) {
          case this.userInfoTypes.PersonInfo:
            return [component, value as UserInfo];
          case this.userInfoTypes.CycledInfo:
            return [component, value as CycledInfo];
          default:
            return [component, value];
        }
      });
    }),
  );
  userInfoTypes = UserInfoComponentTypes;

  constructor(public screenService: ScreenService, private jsonHelperService: JsonHelperService) {}
}
