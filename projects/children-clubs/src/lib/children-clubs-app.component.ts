import { Component, Injector, OnInit } from '@angular/core';
import { AppBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue } from './children-clubs.types';

@Component({
  selector: 'children-clubs-app',
  template: `
    <children-clubs-project-list-page></children-clubs-project-list-page>
    <p>
      children-clubs app works!
      <button (click)="closeApp()">closeApp</button>
      {{ inputAppData?.componentId }}
    </p>
  `,
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
