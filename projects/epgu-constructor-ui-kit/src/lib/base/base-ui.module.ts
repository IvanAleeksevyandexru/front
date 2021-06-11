import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MaskHandleModule } from './pipes/mask-handle/mask-handle.module';
import { RankModule } from './pipes/rank/rank.module';
import { SafeModule } from './pipes/safe/safe.module';
import { ImgPrefixerModule } from './pipes/img-prefixer/img-prefixer.module';
import { LongButtonModule } from './components/long-button/long-button.module';

/**
 * Здесь хранится всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EpguLibModule.forRoot(),
    PerfectScrollbarModule,
    LongButtonModule,
    MaskHandleModule,
    SafeModule,
    RankModule,
    ImgPrefixerModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    LongButtonModule,
    EpguLibModule,
    MaskHandleModule,
    SafeModule,
    RankModule,
    ImgPrefixerModule,
  ],
})
export class BaseUiModule {}

