import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConstructorModule } from 'dist/epgu-constructor';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';


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
      externalApiUrl: environment.externalApiUrl,
      isProd: environment.production,
      fileUploadApiUrl: environment.fileUploadApiUrl,
      fileUploadLocalhostApiUrl: environment.fileUploadLocalhostApiUrl,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
