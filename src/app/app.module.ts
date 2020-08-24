import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConstructorModule } from 'dist/epgu-constructor';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ConstructorConfigInterface } from '../../projects/epgu-constructor/src/interfaces/constructor-config.interface'

const constructorConfig: ConstructorConfigInterface = {
  serviceId: environment.serviceId,
  apiUrl: environment.apiUrl,
  dictionaryUrl: environment.dictionaryUrl,
  externalApiUrl: environment.externalApiUrl,
  externalUrl: environment.externalUrl,
  yandexMapsApiKey: environment.yandexMapsApiKey,
  isProd: environment.production,
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ConstructorModule.forRoot(constructorConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
