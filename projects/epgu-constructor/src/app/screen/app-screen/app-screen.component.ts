import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { CfSpaStateService, LocationService } from '@epgu/epgu-constructor-ui-kit';
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
    private cfSpaStateService: CfSpaStateService,
    private locationService: LocationService,
    private configService: ConfigService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const outputSpaData = this.cfSpaStateService.getState<OutputAppDto>(DataDirectionType.OUTPUT);

    if (outputSpaData) {
      this.handleOutputSpaData(outputSpaData);
    } else {
      this.sendDataToSpa();
      this.redirectToSpa();
    }
  }

  private handleOutputSpaData(outputSpaData: OutputAppDto): void {
    // TODO: add checking output id and type logic

    const { value } = outputSpaData;
    const componentId = this.screenService.component.id;
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

  private sendDataToSpa(): void {
    const spaInputState = this.getSpaInputState();
    this.cfSpaStateService.setState(spaInputState, DataDirectionType.INPUT);
  }

  private getSpaInputState(): InputAppDto {
    return {
      componentId: this.screenService.component.id,
      componentType: this.screenService.componentType,
      value: this.screenService.component.value,
      callbackRedirectUrl: this.locationService.getHref(),
      isPrevStepCase: false, // TODO: добавить логику для передачи параметра
    };
  }

  private redirectToSpa(): void {
    const { appPathMap } = this.configService;
    const appPath = appPathMap[this.screenService.componentType];
    // TODO: добавить логику на проверку наличия пути
    this.locationService.href(appPath);
  }
}
