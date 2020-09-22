import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormPlayerModule } from 'dist/epgu-constructor';
import { EpguLibCommonModule, EpguLibModule } from 'epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../../projects/epgu-constructor/src/app/config/config.service';
import { UnsubscribeService } from '../../projects/epgu-constructor/src/app/services/unsubscribe/unsubscribe.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AppService } from './app.service';
import { ConfigComponent } from './config/config.component';
import { FpContainerComponent } from './fp-container/fp-container.component';
import { LayoutModule } from './layout/layout.module';


@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    FpContainerComponent,
  ],
  imports: [
    EpguLibCommonModule,
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

