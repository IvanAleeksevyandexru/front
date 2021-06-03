import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramListContainerComponent } from './container/program-list-container.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EpguCfUiKitModule } from '@epgu/epgu-constructor-ui-kit';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ProgramListService } from './program-list.service';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [ProgramListContainerComponent, ListComponent],
  imports: [CommonModule, PerfectScrollbarModule, EpguCfUiKitModule, EpguLibModule],
  providers: [ProgramListService],
  exports: [ProgramListContainerComponent],
})
export class ProgramListModule {}
