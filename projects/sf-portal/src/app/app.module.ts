import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { UserAuthInterceptor } from './interceptors/userAuth/user-auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppConfig } from './app.config';
import { ConstantsService } from '@epgu/ui/services/constants';
import { LoadService } from '@epgu/ui/services/load';
import { FocusManager } from '@epgu/ui/services/focus';
import { BaseModule } from '@epgu/ui/base';
import { HeaderModule } from '@epgu/ui/components/header';
import { SmallFooterModule } from '@epgu/ui/components/small-footer';
import { CookieModule } from 'ngx-cookie';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NewSfPlayerComponent } from './components/new-sf-player/new-sf-player.component';
import { LocationSelectModule } from '@epgu/ui/components/location-select';
import { FormPlayerModule } from '@epgu/epgu-constructor';
import { FrameModule } from '@epgu/ui/components/frame';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreUiModule } from '@epgu/epgu-constructor-ui-kit';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { IframePlayerService } from './services/iframe-player/iframe-player.service';
import { PsoModule } from '@epgu/ui/components/pso';

registerLocaleData(localeRu);

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [AppComponent, NewSfPlayerComponent, NotFoundComponent],
  imports: [
    CoreUiModule,
    HttpClientModule,
    NgxPageScrollCoreModule.forRoot(),
    TranslateModule.forRoot(),
    CommonModule,
    CookieModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    BaseModule,
    HeaderModule,
    SmallFooterModule,
    LocationSelectModule,
    FormPlayerModule,
    FrameModule,
    PsoModule,
  ],
  providers: [
    ConstantsService,
    LoadService,
    FocusManager,
    IframePlayerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserAuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'ru' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
