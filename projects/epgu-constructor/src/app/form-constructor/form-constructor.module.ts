import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';


import { SharedModule } from '../shared/shared.module';
import { FormConstructorComponent } from './form-constructor.component';

const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Домен конструктора форм. Сдесь храняться тулзы для создания сценариев.
 *
 * TODO: будем тут имплементить логику создания сценариев
 */
@NgModule({
  declarations: [
    FormConstructorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModuleInited,
  ],
  exports: [
    FormConstructorComponent,
  ],
  entryComponents: [
    FormConstructorComponent,
  ]
})
export class FormConstructorModule {}
