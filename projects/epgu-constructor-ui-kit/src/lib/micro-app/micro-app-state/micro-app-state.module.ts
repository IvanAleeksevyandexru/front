import { NgModule } from '@angular/core';
import { MicroAppStateStore } from './micro-app-state.store';
import { MicroAppStateService } from './micro-app-state.service';
import { MicroAppStateQuery } from './micro-app-state.query';

@NgModule({
  providers: [
    MicroAppStateStore,
    MicroAppStateService,
    MicroAppStateQuery
  ]
})
export class MicroAppStateModule {}
