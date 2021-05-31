import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaskHandleModule } from './pipes/mask-handle/mask-handle.module';
import { RankModule } from './pipes/rank/rank.module';
import { SafeModule } from './pipes/safe/safe.module';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Здесь хранится всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EpguLibModule.forRoot(),
    MaskHandleModule,
    SafeModule,
    RankModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    EpguLibModule,
    MaskHandleModule,
    SafeModule,
    RankModule,
  ],
})
export class BaseModule {}

