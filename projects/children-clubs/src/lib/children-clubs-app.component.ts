import { Component, Injector, OnInit } from '@angular/core';
import { AppBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue } from './children-clubs.types';

@Component({
  selector: 'children-clubs-app',
  template: `<epgu-cf-ui-app-component-resolver></epgu-cf-ui-app-component-resolver>`,
  styles: [],
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
