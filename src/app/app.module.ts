import { HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormPlayerModule } from 'dist/epgu-constructor';
import { EpguLibCommonModule, EpguLibModule, LoadService } from '@epgu/epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService, UnsubscribeService } from 'epgu-constructor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AppService } from './app.service';
import { ConfigComponent } from './config/config.component';
import { FpContainerComponent } from './fp-container/fp-container.component';
import { LayoutModule } from './layout/layout.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../environments/environment';
import '@angular/common/locales/global/ru';
import { ChildrenClubsModule } from '@epgu/children-clubs/src/public-api'
import { ChildrenClubsContainerComponent } from './children-clubs-container/children-clubs-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    FpContainerComponent,
    ChildrenClubsContainerComponent
  ],
  imports: [
    EpguLibModule,
    ChildrenClubsModule,
    EpguLibCommonModule,
    LayoutModule,
    HttpClientModule,
    FormPlayerModule,
    AppRoutingModule,
    ReactiveFormsModule,
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
