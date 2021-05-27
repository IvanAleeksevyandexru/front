import { Component, OnInit } from '@angular/core';
import { CfSpaStateService } from '@epgu/epgu-constructor-ui-kit';
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
  constructor(private cfSpaStateService: CfSpaStateService) {}
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
    }, 3000);
  }
}
