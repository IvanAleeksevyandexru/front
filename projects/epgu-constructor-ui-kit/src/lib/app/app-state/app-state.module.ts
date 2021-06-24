import { NgModule } from '@angular/core';
import { AppStateStore } from './app-state.store';
import { AppStateService } from './app-state.service';
import { AppStateQuery } from './app-state.query';

@NgModule({
  providers: [
    AppStateStore,
    AppStateService,
    AppStateQuery
  ]
})
export class AppStateModule {}
