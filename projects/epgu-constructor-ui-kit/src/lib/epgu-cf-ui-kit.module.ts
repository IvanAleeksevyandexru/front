import { NgModule } from '@angular/core';
import { LongButtonModule } from './components/index';
import { LocalStorageService } from './services/index';


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
