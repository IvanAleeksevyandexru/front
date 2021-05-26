import { NgModule } from '@angular/core';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../shared/base.module';
import { SpaScreenComponent } from './spa-screen.component';

@NgModule({
  declarations: [SpaScreenComponent],
  exports: [SpaScreenComponent],
  imports: [BaseModule],
  providers: [EventBusService]
})
export class SpaScreenModule {}
