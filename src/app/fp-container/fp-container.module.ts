import { NgModule } from '@angular/core';
import { FormPlayerModule } from '@epgu/epgu-constructor';
import { AppService } from '../app.service'
import { FpRoutingModule } from './fp-container.routing'
import { CommonModule } from '@angular/common';
import { FpContainerComponent } from './fp-container.component'


@NgModule({
  declarations: [FpContainerComponent],
  imports: [
    CommonModule,
    FormPlayerModule,
    FpRoutingModule,
  ],
  providers: [
    AppService,
  ],
})
export class FpContainerModule {
}
