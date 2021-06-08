import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import { EpguCfUiKitModule } from '@epgu/epgu-constructor-ui-kit';

import { ProgramListContainerComponent } from './container/program-list-container.component';
import { ProgramListService } from './program-list.service';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [ProgramListContainerComponent, ListComponent],
  imports: [CommonModule, EpguLibModule, EpguCfUiKitModule],
  providers: [ProgramListService],
  exports: [ProgramListContainerComponent],
})
export class ProgramListModule {}