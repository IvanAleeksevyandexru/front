import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';


/**
 * Домен компанент. Сдесь храниться всё что связанно со компанентами и их обязками.
 *
 * TODO: Сюда будем переносить компаненты из домена скринов
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
})
export class ComponentModule {}
