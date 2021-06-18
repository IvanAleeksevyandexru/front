import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import {
  LongButtonModule,
  ScreenContainerModule,
  ScreenPadModule
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListContainerComponent } from './container/program-list-container.component';
import { ProgramListService } from './program-list.service';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';

@NgModule({
  declarations: [ProgramListContainerComponent, ListComponent, ItemComponent],
  imports: [CommonModule, EpguLibModule, LongButtonModule, ScreenPadModule, ScreenContainerModule],
  providers: [ProgramListService],
  exports: [ProgramListContainerComponent],
})
export class ProgramListModule {}
