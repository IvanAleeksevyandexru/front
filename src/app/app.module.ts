import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {ConstructorModule} from '@epgu-constructor';
import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConstructorModule.forRoot({
      serviceId: environment.serviceId,
      apiUrl: environment.apiUrl,
      dictionaryUrl: environment.dictionaryUrl
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
