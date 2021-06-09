import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LogicComponent } from './component/logic.component';
import { LogicService } from './service/logic.service';
import { LogicErrorInterceptor } from './interceptor/logic-error-interceptor.service';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [LogicComponent],
  exports: [LogicComponent],
  imports: [CommonModule, BaseModule],
  providers: [
    LogicService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogicErrorInterceptor,
      multi: true,
    },
  ],
})
export class LogicScreenModule {}
