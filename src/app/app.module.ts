import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormPlayerModule } from 'dist/epgu-constructor';
import { FormPlayerConfigInterface } from '../../projects/epgu-constructor/src/interfaces/form-player-config.interface';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service'

const formPlayerConfig: FormPlayerConfigInterface = {
  serviceId: environment.serviceId,
  apiUrl: environment.apiUrl,
  dictionaryUrl: environment.dictionaryUrl,
  externalApiUrl: environment.externalApiUrl,
  externalLkApiUrl: environment.externalLkApiUrl,
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

