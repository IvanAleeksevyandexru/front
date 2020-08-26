import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConstructorModule } from 'dist/epgu-constructor';
import { ConstructorConfigInterface } from '../../projects/epgu-constructor/src/interfaces/constructor-config.interface';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

const constructorConfig: ConstructorConfigInterface = {
  serviceId: environment.serviceId,
  apiUrl: environment.apiUrl,
  dictionaryUrl: environment.dictionaryUrl,
  externalApiUrl: environment.externalApiUrl,
  externalUrl: environment.externalUrl,
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

    ConstructorModule.forRoot(constructorConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
