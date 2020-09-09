import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormPlayerModule } from 'dist/epgu-constructor';
import { Config } from '../../projects/epgu-constructor/src/app/config/config.types';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service'

const formPlayerConfig: Config = {
  apiUrl: environment.apiUrl,
  dictionaryUrl: environment.dictionaryUrl,
  externalApiUrl: environment.externalApiUrl,
  timeSlotApiUrl: environment.timeSlotApiUrl,
  externalUrl: environment.externalUrl,
  paymentUrl: environment.paymentUrl,
  yandexMapsApiKey: environment.yandexMapsApiKey,
  isProd: environment.production,
  fileUploadApiUrl: environment.fileUploadApiUrl,
  externalLkUrl: environment.externalLkUrl,
  fileUploadLocalhostApiUrl: environment.fileUploadLocalhostApiUrl,
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormPlayerModule.forRoot(formPlayerConfig),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

