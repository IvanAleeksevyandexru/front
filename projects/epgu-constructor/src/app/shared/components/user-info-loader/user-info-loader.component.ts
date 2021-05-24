import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../screen/screen.service';
import { UserInfoComponentTypes } from './user-info-loader.types';

import { UserInfoType } from '../user-info/user-info.type';
import { ComponentValue } from '../../../screen/screen-content';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';

@Component({
  selector: 'epgu-constructor-user-info-loader',
  templateUrl: './user-info-loader.component.html',
  styleUrls: ['./user-info-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoLoaderComponent {
  @Input() isDisplay = true;

  components$: Observable<[ComponentDto, ComponentValue][]> = of([1, 1]).pipe(
    concatMap(() =>
      this.isDisplay
        ? this.screenService.displayInfoComponents$.pipe(
            tap((v) => {
              this.loggerService.log(['display', v]);
            }),
          )
        : this.screenService.componentInfoComponents$.pipe(
            tap((v) => {
              this.loggerService.log(['component', v]);
            }),
          ),
    ),
    map((components) => {
      return components.map(([component, value]: [ComponentDto, ComponentValue]) => {
        switch (component.type) {
          case (this.componentTypes.PersonInfo as unknown) as UniqueScreenComponentTypes:
            return [component, value as UserInfoType];
          default:
            return [component, value];
        }
      });
    }),
  );
  componentTypes = UserInfoComponentTypes;
  constructor(public screenService: ScreenService, private loggerService: LoggerService) {}
}
