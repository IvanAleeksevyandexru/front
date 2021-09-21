import { NgModule } from '@angular/core';
import { BaseUiModule } from '../../base-ui.module';
import { Icons } from './constants';
import { YandexMapComponent } from './yandex-map.component';
import { YandexMapService } from './yandex-map.service';

@NgModule({
  declarations: [YandexMapComponent],
  providers: [YandexMapService, Icons],
  imports: [BaseUiModule],
  exports: [YandexMapComponent],
})
export class YandexMapModule {}
