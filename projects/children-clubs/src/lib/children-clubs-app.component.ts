import { Component, OnInit } from '@angular/core';
import { CfSpaStateService, LocationService } from '@epgu/epgu-constructor-ui-kit';
import { InputSpaDto, SpaDataDirectionType } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'children-clubs-app',
  template: `
    <p>
      children-clubs app works!

      {{ initState.componentId }}
    </p>
  `,
  styles: [],
})
export class ChildrenClubsAppComponent implements OnInit {
  initState = this.cfSpaStateService.getState<InputSpaDto>(SpaDataDirectionType.INPUT);
  constructor(
    private cfSpaStateService: CfSpaStateService,
    private locationService: LocationService,
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.cfSpaStateService.setState(
        {
          componentId: this.initState.componentId,
          componentType: this.initState.componentType,
          value: '{"someProperty": 42}',
        },
        SpaDataDirectionType.OUTPUT,
      );
      this.locationService.href(this.initState.callbackRedirectUrl);
    }, 3000);
  }
}
