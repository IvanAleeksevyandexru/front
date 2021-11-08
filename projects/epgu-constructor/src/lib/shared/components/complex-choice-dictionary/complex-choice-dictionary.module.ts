import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChipModule,
  ConstructorLookupModule,
  ModalService,
  ConstructorCheckboxModule,
  ConstructorDropdownModule,
  TreeResolverModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ComplexChoiceDictionaryComponent } from './complex-choice-dictionary-wrapper/complex-choice-dictionary.component';
import { ComplexChoiceDictionaryModalComponent } from './complex-choice-dictionary-modal/complex-choice-dictionary-modal.component';
import { BaseModule } from '../../base.module';
import { ConstructorPlainInputModule } from '../constructor-plain-input/constructor-plain-input.module';
import { ConfirmationModalModule } from '../../../modal/confirmation-modal/confirmation-modal.module';
import { DropdownListModalModule } from '../../../modal/dropdown-list-modal/dropdown-list-modal.module';

@NgModule({
  declarations: [ComplexChoiceDictionaryComponent, ComplexChoiceDictionaryModalComponent],
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
    TreeResolverModule,
  ],
  providers: [ModalService],
  exports: [ComplexChoiceDictionaryComponent],
  entryComponents: [ComplexChoiceDictionaryModalComponent],
})
export class ComplexChoiceDictionaryModule {}
