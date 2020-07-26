import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    AppRoutingModule,
    ConstructorModule,
    EpguLibCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
