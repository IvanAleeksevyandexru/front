import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogicComponentsContainerComponent } from './component/logic-components-container.component';
import { LogicService } from './service/logic.service';
import { LogicErrorInterceptor } from './interceptor/logic-error-interceptor.service';
import { BaseModule } from '../../shared/base.module';
import { RestService } from '../../shared/services/rest/rest.service';
import { LogicComponentResolverModule } from './component-list-resolver/logic-component-resolver.module';
import RestCallComponent from './components/rest-call/rest-call.component';
import ValueCalculatorComponent from './components/value-calculator/value-calculator.component';

@NgModule({
  declarations: [LogicComponentsContainerComponent, RestCallComponent, ValueCalculatorComponent],
  exports: [LogicComponentsContainerComponent],
  imports: [CommonModule, BaseModule, LogicComponentResolverModule],
  providers: [
    LogicService,
    RestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogicErrorInterceptor,
      multi: true,
    },
  ],
})
export class LogicScreenModule {}
