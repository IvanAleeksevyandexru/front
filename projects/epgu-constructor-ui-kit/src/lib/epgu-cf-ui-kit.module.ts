import { NgModule } from '@angular/core';
// Сокращать пути до ./components и ./services нельзя, т.к. будет ошибка при `ng build epgu-constructor --prod`
import { LongButtonModule } from './components/long-button/long-button.module';
import { CfSpaStateService } from './services/cf-spa-state/cf-spa-state.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { LocationService } from './services/location/location.service';
import { WINDOW_PROVIDERS } from './providers/window.provider';

@NgModule({
  imports: [
    LongButtonModule
  ],
  providers: [
    LocalStorageService,
    CfSpaStateService,
    LocationService,
    WINDOW_PROVIDERS,
  ],
  exports: [
    LongButtonModule
  ]
})
export class EpguCfUiKitModule { }

