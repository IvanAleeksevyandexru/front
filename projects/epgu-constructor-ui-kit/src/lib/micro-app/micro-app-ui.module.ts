import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { MicroAppRoutingService } from './micro-app-routing/micro-app-routing.service';
import { MicroAppStateModule } from './micro-app-state/micro-app-state.module';
import { MicroAppBaseModule } from './micro-app-base/micro-app-base.module';
import { MicroAppComponentResolverComponent } from './micro-app-component-resolver/micro-app-component-resolver.component';
import { MicroAppNavigationService } from './micro-app-navigation/micro-app-navigation.service';
import { MicroAppNavigationRuleService } from './micro-app-navigation-rule/micro-app-navigation-rule.service';
import { MicroAppUiConfig } from './micro-app-ui.type';
import { PREV_BUTTON_NAVIGATION } from '../base/components/prev-button/prev-button.token';
import { MicroAppPrevButtonNavigationService } from './micro-app-prev-button-navigation/micro-app-prev-button-navigation.service';
import { ERROR_HANDLER_ORDER_PARAMS_SERVICES } from '../core/services/global-error/global-error.token';
import {
  MicroAppErrorHandlerOrderParamsServiceService
} from './micro-app-error-handler-order-params-service/micro-app-error-handler-order-params-service.service';

export const APP_ROUTING_COMPONENT_MAP = new InjectionToken<string>('appRoutingComponentMap');
export const APP_NAVIGATION_RULE_MAP = new InjectionToken<string>('appNavigationRuleMap');

@NgModule({
  declarations: [MicroAppComponentResolverComponent],
  imports: [MicroAppStateModule, MicroAppBaseModule],
  exports: [MicroAppStateModule, MicroAppBaseModule, MicroAppComponentResolverComponent],
})
export class MicroAppUiModule {
  constructor(
    private appRoutingService: MicroAppRoutingService,
    private appNavigationRuleService: MicroAppNavigationRuleService,
    @Inject(APP_NAVIGATION_RULE_MAP) private appNavigationRuleMap,
    @Inject(APP_ROUTING_COMPONENT_MAP) private appRoutingComponentMap,
  ) {
    this.appNavigationRuleService.initRule(this.appNavigationRuleMap);
    this.appRoutingService.initRouting(this.appRoutingComponentMap);
  }

  static forRoot(
    appUiConfig: MicroAppUiConfig,
  ): ModuleWithProviders<MicroAppUiModule> {
    return {
      ngModule: MicroAppUiModule,
      providers: [
        { provide: APP_ROUTING_COMPONENT_MAP, useValue: appUiConfig.appRoutingComponentMap },
        { provide: APP_NAVIGATION_RULE_MAP, useValue: appUiConfig.appNavigationRuleMap },
        MicroAppRoutingService,
        MicroAppNavigationService,
        MicroAppNavigationRuleService,
        {
          provide: PREV_BUTTON_NAVIGATION,
          useClass: MicroAppPrevButtonNavigationService,
        },
        {
          provide: ERROR_HANDLER_ORDER_PARAMS_SERVICES,
          useClass: MicroAppErrorHandlerOrderParamsServiceService,
        }
      ],
    };
  }
}
