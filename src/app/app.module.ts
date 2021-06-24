import { HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibCommonModule, EpguLibModule, LoadService } from '@epgu/epgu-lib';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit'
import { CookieService } from 'ngx-cookie-service';
import '@angular/common/locales/global/ru';
import { DeviceDetectorService } from 'ngx-device-detector';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AppService } from './app.service';
import { ConfigComponent } from './config/config.component';
import { LayoutModule } from './layout/layout.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
  ],
  imports: [
    CommonModule,
    EpguLibModule,
    EpguLibCommonModule,
    LayoutModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  providers: [
    CookieService,
    AppService,
    UnsubscribeService,
    ConfigService,
    DeviceDetectorService,
    LoadService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private loadService: LoadService) {
    const initCoreConfigs = () => {
      if (!isDevMode()) {
        // @ts-ignore
        window.serverData = environment.core;
      }
    };
    initCoreConfigs();

    loadService.load('core');
  }
}
