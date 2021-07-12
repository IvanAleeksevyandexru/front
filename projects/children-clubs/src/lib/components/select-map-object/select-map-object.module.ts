import { NgModule } from '@angular/core';
import { SelectMapObjectComponent } from './select-map-object.component';
import { EpguLibModule, NotifierService } from '@epgu/epgu-lib';
import { CommonModule } from '@angular/common';
import {
  Icons,
  YandexMapModule,
} from '@epgu/epgu-constructor-ui-kit';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [SelectMapObjectComponent],
  providers: [
    Icons,
    NotifierService,
    {
      provide: 'notifierSetting',
      useValue: { singleNotifier: true },
    },
  ],
  exports: [SelectMapObjectComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    PerfectScrollbarModule,
    YandexMapModule,
  ],
  entryComponents: [SelectMapObjectComponent],
})
export class SelectMapObjectModule {}
