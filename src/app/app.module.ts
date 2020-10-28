import { HttpClientModule } from '@angular/common/http';
import {isDevMode, NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormPlayerModule } from 'dist/epgu-constructor';
import {EpguLibCommonModule, EpguLibModule, LoadService} from 'epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../../projects/epgu-constructor/src/app/shared/config/config.service';
import { UnsubscribeService } from '../../projects/epgu-constructor/src/app/shared/services/unsubscribe/unsubscribe.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AppService } from './app.service';
import { ConfigComponent } from './config/config.component';
import { FpContainerComponent } from './fp-container/fp-container.component';
import { LayoutModule } from './layout/layout.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    FpContainerComponent,
  ],
  imports: [
    EpguLibCommonModule,
    LayoutModule,
    HttpClientModule,
    FormPlayerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    EpguLibModule,
  ],
  providers: [
    CookieService,
    AppService,
    UnsubscribeService,
    ConfigService,
    DeviceDetectorService,
    LoadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private loadService: LoadService) {
    const initCoreConfigs = () => {
      if (!isDevMode()) {
        // @ts-ignore
        window.serverData = environment.core
      }
    };
    initCoreConfigs();

    loadService.load('core');
  }
}

