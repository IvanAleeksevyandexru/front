import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ConstructorModule} from '../constructor/constructor.module';
import {EpguLibCommonModule} from 'epgu-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ConstructorModule,
    EpguLibCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
