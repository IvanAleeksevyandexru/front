import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from '@epgu/epgu-lib';
import { LongButtonModule, BaseUiModule, MaskHandleModule, RankModule, SafeModule } from '@epgu/epgu-constructor-ui-kit';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ActionModule } from './directives/action/action.module';
import { OutputHtmlModule } from './components/output-html/output-html.module';
import { ImgPrefixerModule } from './pipes/img-prefixer/img-prefixer.module';

export const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Здесь храниться всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [
    CommonModule,
    BaseUiModule,
    ReactiveFormsModule,
    EpguLibModuleInited,
    LongButtonModule,
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
    BaseUiModule,
    ReactiveFormsModule,
    EpguLibModule,
    LongButtonModule,
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
