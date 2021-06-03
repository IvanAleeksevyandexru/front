import { Component, OnInit } from '@angular/core';
import { CfAppStateService, LocationService } from '@epgu/epgu-constructor-ui-kit';
import { InputAppDto, DataDirectionType } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'children-clubs-app',
  template: `
    <p>
      children-clubs app works!
      <children-clubs-program-list></children-clubs-program-list>
<!--      {{ initState.componentId }}-->
    </p>
  `,
  styles: [],
})
export class ChildrenClubsAppComponent implements OnInit {
  // initState = this.cfAppStateService.getState<InputAppDto>(DataDirectionType.INPUT);
  constructor(
    private cfAppStateService: CfAppStateService,
    private locationService: LocationService,
  ) {}
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.cfAppStateService.setState(
    //     {
    //       componentId: this.initState.componentId,
    //       componentType: this.initState.componentType,
    //       value: '{"someProperty": 42}',
    //       isPrevStepCase: false, // передавать true усли с первого экрана нажали назад
    //     },
    //     DataDirectionType.OUTPUT,
    //   );
    //   this.locationService.href(this.initState.callbackRedirectUrl);
    // }, 3000);
  }
}
