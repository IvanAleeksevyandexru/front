import { HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { UnsubscribeService, ConfigService, BaseUiModule } from '@epgu/epgu-constructor-ui-kit';
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
import { LoadService } from '@epgu/ui/services/load';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, ConfigComponent],
  imports: [
    CommonModule,
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    BaseUiModule,
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
  entryComponents: [ConfigComponent]
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
