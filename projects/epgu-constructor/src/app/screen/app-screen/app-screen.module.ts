import { NgModule } from '@angular/core';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../shared/base.module';
import { AppScreenComponent } from './app-screen.component';

@NgModule({
  declarations: [AppScreenComponent],
  exports: [AppScreenComponent],
  imports: [BaseModule],
  providers: [EventBusService]
})
export class AppScreenModule {}
