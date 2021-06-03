import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankPipe } from './rank.pipe';

@NgModule({
  declarations: [RankPipe],
  imports: [CommonModule],
  exports: [RankPipe],
})
export class RankModule {}
