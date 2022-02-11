import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUiModule, Icons, YandexMapModule } from '@epgu/epgu-constructor-ui-kit';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { NotifierService } from '@epgu/ui/services/notifier';
import { PluralizeModule } from '@epgu/ui/pipes';
import { SelectMapObjectComponent } from './select-map-object.component';

@NgModule({
  declarations: [SelectMapObjectComponent],
  providers: [
    Icons,
    NotifierService,
    {
      provide: 'notifierSetting',
      useValue: { singleNotifier: false },
    },
  ],
  exports: [SelectMapObjectComponent],
  imports: [
    CommonModule,
    NotifierModule,
    BaseUiModule,
    PerfectScrollbarModule,
    YandexMapModule,
    PluralizeModule,
  ],
})
export class SelectMapObjectModule {}
