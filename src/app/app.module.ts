import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ConstructorModule} from '../constructor/constructor.module';
import {EpguLibCommonModule} from 'epgu-lib';
import { ConfirmPersonalUserDataScreenComponent } from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmPersonalUserDataScreenComponent
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
