import { NgModule } from '@angular/core';

import { BaseModule } from '../../shared/base.module';
import { DropdownListComponent } from './components/dropdown-list/dropdown-list.component';
import { DropdownListModalComponent } from './components/dropdown-list-modal.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';
import { HighlightModule } from '@epgu/ui/pipes';

@NgModule({
  declarations: [DropdownListModalComponent, DropdownListComponent, FilterPipe],
  imports: [BaseModule, ConfirmationModalModule, HighlightModule],
  exports: [DropdownListModalComponent],
  entryComponents: [DropdownListModalComponent],
})
export class DropdownListModalModule {}
