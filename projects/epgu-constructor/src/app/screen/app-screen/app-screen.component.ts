import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { CfAppStateService, LocationService } from '@epgu/epgu-constructor-ui-kit';
import { InputAppDto, OutputAppDto, DataDirectionType } from '@epgu/epgu-constructor-types';

import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screen-base';
import { ConfigService } from '../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-spa-screen',
  templateUrl: './app-screen.component.html',
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppScreenComponent extends ScreenBase implements OnInit {
  constructor(
    public injector: Injector,
    private cfAppStateService: CfAppStateService,
    private locationService: LocationService,
    private configService: ConfigService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const outputSpaData = this.cfAppStateService.getState<OutputAppDto>(DataDirectionType.OUTPUT);

    if (outputSpaData) {
      this.handleOutputAppData(outputSpaData);
    } else {
      this.sendDataToApp();
      this.redirectToApp();
    }
  }

  private handleOutputAppData(outputSpaData: OutputAppDto): void {
    const componentId = this.screenService.component.id;
    const componentType = this.screenService.component.type;
    const outputComponentId = outputSpaData.componentId;
    const outputComponentType = outputSpaData.componentType;
    const { isPrevStepCase } = outputSpaData;

    if (componentId !== outputComponentId || componentType !== outputComponentType) {
      throw new Error(
        `Looks like we have some issues. Current component id: ${componentId} and type ${componentType},
         but output data has component id ${outputComponentId} and type ${outputComponentType}`,
      );
    }

    const { value } = outputSpaData;

    const navigation = {
      payload: {
        [componentId]: {
          value,
          visited: true,
        },
      },
    };

    if (isPrevStepCase) {
      this.navigationService.prev(navigation);
    } else {
      this.navigationService.next(navigation);
    }
  }

  private sendDataToApp(): void {
    const spaInputState = this.getAppInputState();
    this.cfAppStateService.setState(spaInputState, DataDirectionType.INPUT);
  }

  private getAppInputState(): InputAppDto {
    const { component } = this.screenService;
    return {
      componentId: component.id,
      componentType: component.type,
      value: component.value,
      callbackRedirectUrl: this.locationService.getHref(),
      isPrevStepCase: false, // TODO: добавить логику для передачи параметра
    };
  }

  private redirectToApp(): void {
    const { appPathMap } = this.configService;
    const appPath = appPathMap[this.screenService.component.type];

    if (!appPath) {
      throw new Error(
        `Looks like we have wrong settings for component type: ${this.screenService.component.type}. Need to set app url.`,
      );
    }

    this.locationService.href(appPath);
  }
}
