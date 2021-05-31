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
    this.navigationService.next(navigation);
  }

  private sendDataToApp(): void {
    const spaInputState = this.getAppInputState();
    this.cfAppStateService.setState(spaInputState, DataDirectionType.INPUT);
  }

  private getAppInputState(): InputAppDto {
    return {
      componentId: this.screenService.component.id,
      componentType: this.screenService.componentType,
      value: this.screenService.component.value,
      callbackRedirectUrl: this.locationService.getHref(),
      isPrevStepCase: false, // TODO: добавить логику для передачи параметра
    };
  }

  private redirectToApp(): void {
    const { appPathMap } = this.configService;
    const appPath = appPathMap[this.screenService.componentType];
    // TODO: добавить логику на проверку наличия пути
    this.locationService.href(appPath);
  }
}
