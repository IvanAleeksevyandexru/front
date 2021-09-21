import { NgModule } from '@angular/core';
import { SelectMapObjectComponent } from './select-map-object.component';
import { CommonModule } from '@angular/common';
import { BaseUiModule, Icons, YandexMapModule } from '@epgu/epgu-constructor-ui-kit';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { NotifierService } from '@epgu/ui/services/notifier';

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
  imports: [CommonModule, NotifierModule, BaseUiModule, PerfectScrollbarModule, YandexMapModule],
  entryComponents: [SelectMapObjectComponent],
})
export class SelectMapObjectModule {}
