import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { CachedAnswersService } from './services/applicant-answers/cached-answers.service';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { UtilsService } from './services/utils/utils.service';
import { CoreModule } from '../core/core.module';
import { DateRangeService } from './services/date-range/date-range.service';

const COMPONENTS = [];

const PIPES = [];

const DIRECTIVES = [];

/**
 * Шара. Тут храним что необходимо одновременно нескольким другим доменам.
 *
 * TODO: Разбить модуль, создать core домен для общих штук, оставить только специфик шарабл кейсы
 */
@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  providers: [
    CachedAnswersService,
    TerraByteApiService,
    CurrencyPipe,
    UtilsService,
    DateRangeService,
  ],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [CoreModule],
  entryComponents: [],
})
export class SharedModule {}
