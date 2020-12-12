import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';

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
  providers: [],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [CoreModule],
  entryComponents: [],
})
export class SharedModule {}
