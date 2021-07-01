import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { AppRoutingService } from './app-routing/app-routing.service';
import { AppStateModule } from './app-state/app-state.module';
import { AppBaseModule } from './app-base/app-base.module';
import { AppComponentResolverComponent } from './app-component-resolver/app-component-resolver.component';
import { AppNavigationService } from './app-navigation/app-navigation.service';
import { AppNavigationRuleService } from './app-navigation-rule/app-navigation-rule.service';
import { AppUiConfig } from './app-ui-type';
import { PREV_BUTTON_NAVIGATION } from '../base/components/prev-button/prev-button.token';
import { AppPrevButtonNavigationService } from './app-prev-button-navigation/app-prev-button-navigation.service';
import { ERROR_HANDLER_ORDER_PARAMS_SERVICES } from '../core/services/global-error/global-error.token';
import {
  AppErrorHandlerOrderParamsServiceService
} from './app-error-handler-order-params-service/app-error-handler-order-params-service.service';

export const APP_ROUTING_COMPONENT_MAP = new InjectionToken<string>('appRoutingComponentMap');
export const APP_NAVIGATION_RULE_MAP = new InjectionToken<string>('appNavigationRuleMap');

@NgModule({
  declarations: [AppComponentResolverComponent],
  imports: [AppStateModule, AppBaseModule],
  exports: [AppStateModule, AppBaseModule, AppComponentResolverComponent],
})
export class AppUiModule {
  constructor(
    private appRoutingService: AppRoutingService,
    private appNavigationRuleService: AppNavigationRuleService,
    @Inject(APP_NAVIGATION_RULE_MAP) private appNavigationRuleMap,
    @Inject(APP_ROUTING_COMPONENT_MAP) private appRoutingComponentMap,
  ) {
    this.appNavigationRuleService.initRule(this.appNavigationRuleMap);
    this.appRoutingService.initRouting(this.appRoutingComponentMap);
  }

  static forRoot(
    appUiConfig: AppUiConfig,
  ): ModuleWithProviders<AppUiModule> {
    return {
      ngModule: AppUiModule,
      providers: [
        { provide: APP_ROUTING_COMPONENT_MAP, useValue: appUiConfig.appRoutingComponentMap },
        { provide: APP_NAVIGATION_RULE_MAP, useValue: appUiConfig.appNavigationRuleMap },
        AppRoutingService,
        AppNavigationService,
        AppNavigationRuleService,
        {
          provide: PREV_BUTTON_NAVIGATION,
          useClass: AppPrevButtonNavigationService,
        },
        {
          provide: ERROR_HANDLER_ORDER_PARAMS_SERVICES,
          useClass: AppErrorHandlerOrderParamsServiceService,
        }
      ],
    };
  }
}
