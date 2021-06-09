import { NgModule } from '@angular/core';
// Сокращать пути до ./components и ./services нельзя, т.к. будет ошибка при `ng build epgu-constructor --prod`
import { CfAppStateService } from './services/cf-app-state/cf-app-state.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { LocationService } from './services/location/location.service';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { DeviceDetectorService } from './services/device-detector/device-detector.service';
import { EventBusService } from './services/event-bus/event-bus.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { ConfigService } from './services/config/config.service';
import { LoggerService } from './services/logger/logger.service';

@NgModule({
  providers: [
    LocalStorageService,
    DeviceDetectorService,
    EventBusService,
    UnsubscribeService,
    CfAppStateService,
    LocationService,
    ConfigService,
    LoggerService,
    WINDOW_PROVIDERS,
  ]
})
export class CoreUiModule { }

