import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from '@epgu/epgu-lib';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaskHandleModule } from './pipes/mask-handle/mask-handle.module';
import { ActionModule } from './directives/action/action.module';
import { OutputHtmlModule } from './components/output-html/output-html.module';
import { SafeModule } from './pipes/safe/safe.module';
import { ImgPrefixerModule } from './pipes/img-prefixer/img-prefixer.module';
import { RankModule } from './pipes/rank/rank.module';

export const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Здесь храниться всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EpguLibModuleInited,
    PerfectScrollbarModule,
    MaskHandleModule,
    ActionModule,
    OutputHtmlModule,
    ImgPrefixerModule,
    SafeModule,
    RankModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    EpguLibModule,
    PerfectScrollbarModule,
    MaskHandleModule,
    ActionModule,
    OutputHtmlModule,
    ImgPrefixerModule,
    SafeModule,
    RankModule,
  ],
})
export class BaseModule {}
