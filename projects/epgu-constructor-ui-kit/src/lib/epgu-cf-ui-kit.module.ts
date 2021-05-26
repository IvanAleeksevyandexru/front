import { NgModule } from '@angular/core';
import { LongButtonModule } from './components';
import { CfSpaStateService, LocalStorageService } from './services';


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

