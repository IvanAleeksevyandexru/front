import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AppBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue } from './children-clubs.types';

@Component({
  selector: 'children-clubs-app',
  template: `<epgu-cf-ui-app-component-resolver></epgu-cf-ui-app-component-resolver>`,
  styleUrls: ['../styles/index.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenClubsAppComponent
  extends AppBaseComponent<ChildrenClubsValue, ChildrenClubsState>
  implements OnInit {
  public appType = 'ChildrenClubs';

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.openApp();
  }
}
