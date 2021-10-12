import { MicroAppRoutingComponentMap } from './micro-app-routing/micro-app-routing';
import { MicroAppNavigationRuleMap } from './micro-app-navigation-rule/micro-app-navigation-rule';

export interface MicroAppUiConfig {
  appRoutingComponentMap: MicroAppRoutingComponentMap;
  appNavigationRuleMap: MicroAppNavigationRuleMap;
}
