import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GetVersionsService } from './services/get-versions.service';
import { LibraryVersionsComponent } from './components/library-versions/library-versions.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceVersionsComponent } from './components/service-versions/service-versions.component';
import { ErrorService } from './services/error.service';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [AppComponent, LibraryVersionsComponent, ServiceVersionsComponent, ErrorComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [GetVersionsService, ErrorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
