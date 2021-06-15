import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { AppRoutingService } from './app-routing.service';
import { AppRoutingComponentMap } from './app-routing';

export const APP_ROUTING_COMPONENT_MAP = new InjectionToken<string>('appRoutingComponentMap');

@NgModule({
  declarations: [],
  exports: [],
})
export class AppRoutingModule {
  constructor(private appRoutingService: AppRoutingService, @Inject(APP_ROUTING_COMPONENT_MAP) private appRoutingComponentMap) {
    this.appRoutingService.initRouting(this.appRoutingComponentMap);
  }

  static forRoot(appRoutingComponentMap: AppRoutingComponentMap): ModuleWithProviders<AppRoutingModule> {
    return {
      ngModule: AppRoutingModule,
      providers: [
        { provide: APP_ROUTING_COMPONENT_MAP, useValue: appRoutingComponentMap },
        AppRoutingService,
      ],
    };
  }
}
