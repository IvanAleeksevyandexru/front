import { Injectable } from '@angular/core';
import { AppRoutingComponentMap } from './app-routing';

@Injectable()
export class AppRoutingService {
  appRoutingComponentMap: AppRoutingComponentMap;

  public initRouting(appRoutingComponentMap: AppRoutingComponentMap): void {
    this.appRoutingComponentMap = appRoutingComponentMap;
  }
}
