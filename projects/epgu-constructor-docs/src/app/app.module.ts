import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  TuiAddonDocModule,
  TuiDocExampleModule,
  TuiDocMainModule,
  TuiDocPageModule,
} from '@taiga-ui/addon-doc';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExampleEpguChipModule } from '../components/chip/chip.module';
import { APP_PROVIDERS } from './app.providers';
import { BaseUiModule } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BaseUiModule,
    AppRoutingModule,
    TuiDocMainModule,
    TuiAddonDocModule,
    TuiDocExampleModule,
    TuiDocPageModule,
    ExampleEpguChipModule,
  ],
  providers: APP_PROVIDERS,
  bootstrap: [AppComponent],
})
export class AppModule {}
