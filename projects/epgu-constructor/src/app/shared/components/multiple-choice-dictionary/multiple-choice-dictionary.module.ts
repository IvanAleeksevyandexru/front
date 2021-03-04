import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultipleChoiceDictionaryComponent } from './multiple-choice-dictionary/multiple-choice-dictionary.component';
import { MultiChoiceDictionaryModalComponent } from './multi-choice-dictionary-modal/multi-choice-dictionary-modal.component';
import { ChipModule } from '../chip/chip.module';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalModule } from '../../../modal/confirmation-modal/confirmation-modal.module';
import { BaseModule } from '../../base.module';
import { ConstructorLookupModule } from '../constructor-lookup/constructor-lookup.module';
import { ConstructorDropdownModule } from '../constructor-dropdown/constructor-dropdown.module';
import { ConstructorPlainInputModule } from '../constructor-plain-input/constructor-plain-input.module';
import { ConstructorCheckboxModule } from '../constructor-checkbox/constructor-checkbox.module';

@NgModule({
  declarations: [MultipleChoiceDictionaryComponent, MultiChoiceDictionaryModalComponent],
  imports: [
    CommonModule,
    ChipModule,
    ConfirmationModalModule,
    BaseModule,
    ConstructorLookupModule,
    ConstructorDropdownModule,
    ConstructorPlainInputModule,
    ConstructorCheckboxModule,
  ],
  providers: [ModalService],
  exports: [MultipleChoiceDictionaryComponent],
  entryComponents: [MultiChoiceDictionaryModalComponent],
})
export class MultipleChoiceDictionaryModule {}
