import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

export const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Домен ядра. Сдесь храниться всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpguLibModuleInited,
    PerfectScrollbarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpguLibModule,
    PerfectScrollbarModule
  ]
})
export class CoreModule {}
