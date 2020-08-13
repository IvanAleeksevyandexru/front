import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ConstructorModule} from 'dist/epgu-constructor';
import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    ConstructorModule.forRoot({
      serviceId: environment.serviceId,
      apiUrl: environment.apiUrl,
      dictionaryUrl: environment.dictionaryUrl,
      externalApiUrl: environment.externalApiUrl
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
