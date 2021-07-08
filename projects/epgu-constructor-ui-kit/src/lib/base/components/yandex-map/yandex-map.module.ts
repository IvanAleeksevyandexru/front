import { NgModule } from '@angular/core';
import { EpguLibModule } from '@epgu/epgu-lib';
import { Icons } from './constants';

import { YandexMapComponent } from './yandex-map.component';
import { YandexMapService } from './yandex-map.service';

@NgModule({
  declarations: [YandexMapComponent],
  providers: [
    YandexMapService,
    Icons,
  ],
  imports: [
    EpguLibModule,
  ],
  exports: [
    YandexMapComponent,
  ]
})
export class YandexMapModule {}
