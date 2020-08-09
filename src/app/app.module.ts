import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {ConstructorModule} from '../constructor/constructor.module';
import {EpguLibCommonModule} from 'epgu-lib';
import { DirectivesModule } from './directives/directives.module';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  { path: '', component: ConstructorModule},
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConstructorModule,
    EpguLibCommonModule,
    DirectivesModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
