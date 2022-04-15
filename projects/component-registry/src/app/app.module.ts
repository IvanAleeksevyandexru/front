import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ControlsModule } from '@epgu/ui/controls';
import { BaseModule } from '@epgu/ui/base';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThrobberHexagonModule } from '@epgu/ui/components/throbber-hexagon';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BaseModule,
    BrowserModule,
    ControlsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ThrobberHexagonModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }