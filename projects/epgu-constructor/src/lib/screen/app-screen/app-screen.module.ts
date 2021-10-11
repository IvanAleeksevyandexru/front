import { NgModule } from '@angular/core';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../shared/base.module';
import { AppScreenComponent } from './app-screen.component';

@NgModule({
  declarations: [AppScreenComponent],
  exports: [AppScreenComponent],
  imports: [BaseModule],
  providers: [EventBusService],
})
export class AppScreenModule {}
