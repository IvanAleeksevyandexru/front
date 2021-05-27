import { NgModule } from '@angular/core';
// Сокращать пути до ./components и ./services нельзя, т.к. будет ошибка при `ng build epgu-constructor --prod`
import { LongButtonModule } from './components/long-button/long-button.module';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { CfSpaStateService } from './services/cf-spa-state/cf-spa-state.service';

@NgModule({
  imports: [
    LongButtonModule
  ],
  providers: [
    LocalStorageService,
    CfSpaStateService
  ],
  exports: [
    LongButtonModule
  ]
})
export class EpguCfUiKitModule { }

