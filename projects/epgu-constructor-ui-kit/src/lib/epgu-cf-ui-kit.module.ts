import { NgModule } from '@angular/core';
// Сокращать пути до ./components и ./services нельзя, т.к. будет ошибка при `ng build epgu-constructor --prod`
import { LongButtonModule } from './components/long-button/long-button.module';
import { CfAppStateService } from './services/cf-app-state/cf-app-state.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { LocationService } from './services/location/location.service';
import { WINDOW_PROVIDERS } from './providers/window.provider';

@NgModule({
  imports: [
    LongButtonModule
  ],
  providers: [
    LocalStorageService,
    CfAppStateService,
    LocationService,
    WINDOW_PROVIDERS,
  ],
  exports: [
    LongButtonModule
  ]
})
export class EpguCfUiKitModule { }

