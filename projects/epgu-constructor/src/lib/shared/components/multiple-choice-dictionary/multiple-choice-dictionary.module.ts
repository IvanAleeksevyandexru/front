import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChipModule,
  ConstructorLookupModule,
  ModalService,
  ConstructorCheckboxModule,
  ConstructorDropdownModule,
} from '@epgu/epgu-constructor-ui-kit';
import { MultipleChoiceDictionaryComponent } from './multiple-choice-dictionary/multiple-choice-dictionary.component';
import { MultiChoiceDictionaryModalComponent } from './multi-choice-dictionary-modal/multi-choice-dictionary-modal.component';
import { BaseModule } from '../../base.module';
import { ConstructorPlainInputModule } from '../constructor-plain-input/constructor-plain-input.module';
import { ConfirmationModalModule } from '../../../modal/confirmation-modal/confirmation-modal.module';
import { DropdownListModalModule } from '../../../modal/dropdown-list-modal/dropdown-list-modal.module';

@NgModule({
  declarations: [MultipleChoiceDictionaryComponent, MultiChoiceDictionaryModalComponent],
  imports: [
    CommonModule,
    ChipModule,
    ConfirmationModalModule,
    DropdownListModalModule,
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
