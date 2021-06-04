import { Component, Injector, OnInit } from '@angular/core';
import { AppBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue } from './children-clubs.types';

@Component({
  selector: 'children-clubs-app',
  template: `
    <p>
      children-clubs app works!

      {{ inputAppData.componentId }}
    </p>
  `,
  styles: [],
})
export class ChildrenClubsAppComponent
  extends AppBaseComponent<ChildrenClubsValue, ChildrenClubsState>
  implements OnInit {
  constructor(public injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    this.openApp();
    setTimeout(() => {
      this.closeApp();
    }, 3000);
  }
}
