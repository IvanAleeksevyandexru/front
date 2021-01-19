import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { UserInfoComponentTypes } from './user-info-loader.types';

import { UserInfoType } from '../user-info/user-info.type';
import { ComponentValue } from '../../../screen/screen-content';

@Component({
  selector: 'epgu-constructor-user-info-loader',
  templateUrl: './user-info-loader.component.html',
  styleUrls: ['./user-info-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoLoaderComponent implements OnInit {
  @Input() isDisplay = true;

  components$: Observable<[ComponentDto, ComponentValue][]> = of([1, 1]).pipe(
    concatMap(() =>
      this.isDisplay
        ? this.screenService.displayInfoComponents$.pipe(
            tap((v) => {
              console.log('display', v);
            }),
          )
        : this.screenService.componentInfoComponents$.pipe(
            tap((v) => {
              console.log('component', v);
            }),
          ),
    ),
    map((components) => {
      return components.map(([component, value]: [ComponentDto, ComponentValue]) => {
        switch (component.type) {
          case this.componentTypes.PersonInfo:
            return [component, value as UserInfoType];
          default:
            return [component, value];
        }
      });
    }),
  );
  componentTypes = UserInfoComponentTypes;
  constructor(public screenService: ScreenService) {}

  ngOnInit(): void {}
}
