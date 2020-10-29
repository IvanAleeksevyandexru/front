import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormConstructorComponent } from './form-constructor.component';
import { CoreModule } from '../core/core.module';

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
    CoreModule,
    SharedModule,
  ],
  exports: [
    FormConstructorComponent,
  ],
  entryComponents: [
    FormConstructorComponent,
  ]
})
export class FormConstructorModule {}
