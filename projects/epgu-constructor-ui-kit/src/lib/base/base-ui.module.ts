import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaskHandleModule } from './pipes/mask-handle/mask-handle.module';
import { RankPipeModule } from './pipes/rank/rank-pipe.module';
import { SafeModule } from './pipes/safe/safe.module';
import { ImgPrefixerModule } from './pipes/img-prefixer/img-prefixer.module';
import { LongButtonModule } from './components/long-button/long-button.module';
import { RankModule } from './directives/rank/rank.module';
import { CurrencyModule } from './directives/currency/currency.module';
import { ControlsModule } from '@epgu/ui/controls';
import { BaseModule } from '@epgu/ui/base';
import { ThrobberHexagonModule } from '@epgu/ui/components/throbber-hexagon';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

/**
 * Здесь хранится всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    LongButtonModule,
    MaskHandleModule,
    SafeModule,
    RankPipeModule,
    ImgPrefixerModule,
    RankModule,
    CurrencyModule,
    ControlsModule,
    BaseModule,
    ThrobberHexagonModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    LongButtonModule,
    MaskHandleModule,
    SafeModule,
    RankPipeModule,
    ImgPrefixerModule,
    RankModule,
    CurrencyModule,
    ControlsModule,
    BaseModule,
    ThrobberHexagonModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
})
export class BaseUiModule {}
