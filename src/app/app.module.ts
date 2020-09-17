import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormPlayerModule } from 'dist/epgu-constructor';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { LayoutModule } from './layout/layout.module';
import { ConfigComponent } from './config/config.component';
import { FpContainerComponent } from './fp-container/fp-container.component'
import { AppRoutingModule } from './app.routing'
import { AppService } from './app.service'
import { ReactiveFormsModule } from '@angular/forms'
import { UnsubscribeService } from '../../projects/epgu-constructor/src/app/services/unsubscribe/unsubscribe.service';
import { EpguLibModule } from 'epgu-lib'
import { ConfigService } from '../../projects/epgu-constructor/src/app/config/config.service'


@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    FpContainerComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    FormPlayerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    EpguLibModule,
  ],
  providers: [
    CookieService,
    AppService,
    UnsubscribeService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

