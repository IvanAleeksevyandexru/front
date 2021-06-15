import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MaskHandleModule } from './pipes/mask-handle/mask-handle.module';
import { RankPipeModule } from './pipes/rank/rank-pipe.module';
import { SafeModule } from './pipes/safe/safe.module';
import { ImgPrefixerModule } from './pipes/img-prefixer/img-prefixer.module';
import { LongButtonModule } from './components/long-button/long-button.module';
import { RankModule } from './directives/rank/rank.module';
import { CurrencyModule } from './directives/currency/currency.module';

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
    RankPipeModule,
    ImgPrefixerModule,
    RankModule,
    CurrencyModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    LongButtonModule,
    EpguLibModule,
    MaskHandleModule,
    SafeModule,
    RankPipeModule,
    ImgPrefixerModule,
    RankModule,
    CurrencyModule,
  ],
})
export class BaseUiModule {}

