import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { CfSpaStateService, LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import {
  InputSpaDto,
  OutputSpaDto,
  SPA_OUTPUT_KEY,
  SpaDataDirectionType,
} from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screen-base';
import { LocationService } from '../../core/services/location/location.service';
import { ConfigService } from '../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-spa-screen',
  templateUrl: './spa-screen.component.html',
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaScreenComponent extends ScreenBase implements OnInit {
  constructor(
    public injector: Injector,
    private cfSpaStateService: CfSpaStateService,
    private locationService: LocationService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const outputSpaData = this.localStorageService.get<OutputSpaDto>(SPA_OUTPUT_KEY);

    if (outputSpaData) {
      this.handleOutputSpaData(outputSpaData);
    } else {
      this.sendDataToSpa();
      this.redirectToSpa();
    }
  }

  private handleOutputSpaData(outputSpaData: OutputSpaDto): void {
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
    this.cfSpaStateService.setState(spaInputState, SpaDataDirectionType.INPUT);
  }

  private getSpaInputState(): InputSpaDto {
    return {
      componentId: this.screenService.component.id,
      componentType: this.screenService.componentType,
      value: this.screenService.component.value,
      callbackRedirectUrl: this.locationService.getHref(),
    };
  }

  private redirectToSpa(): void {
    const spaRouting = this.configService.spa;
    const spaPath = spaRouting[this.screenService.componentType];
    this.locationService.href(spaPath);
  }
}
