import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';


const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Домен компанент. Сдесь храниться всё что связанно со компанентами и их обязками.
 *
 * TODO: Сюда будем переносить компаненты из домена скринов
 */
@NgModule({
  imports: [
    CommonModule,
    EpguLibModuleInited
  ],
})
export class ComponentModule {}
