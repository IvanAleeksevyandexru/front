import { NgModule } from '@angular/core';
import { LongButtonModule } from './components';
import { LocalStorageService } from './services';


@NgModule({
  imports: [
    LongButtonModule
  ],
  providers: [LocalStorageService],
  exports: [
    LongButtonModule
  ]
})
export class EpguCfUiKitModule { }

