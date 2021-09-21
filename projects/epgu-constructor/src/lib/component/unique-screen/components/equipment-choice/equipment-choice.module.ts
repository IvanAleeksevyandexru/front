import { NgModule } from '@angular/core';
import { EquipmentChoiceContainerComponent } from './container/equipment-choice-container.component';
import { EquipmentChoiceComponent } from './components/equipment-choice/equipment-choice.component';
import { EquipmentCategoryComponent } from './components/equipment-category/equipment-category.component';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenContainerModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { MultipleChoiceDictionaryModule } from '../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';

@NgModule({
  declarations: [
    EquipmentChoiceContainerComponent,
    EquipmentChoiceComponent,
    EquipmentCategoryComponent,
  ],
  imports: [
    BaseModule,
    DefaultUniqueScreenWrapperModule,
    ScreenContainerModule,
    ScreenPadModule,
    MultipleChoiceDictionaryModule,
    ConstructorPlainInputModule,
  ],
  entryComponents: [EquipmentChoiceContainerComponent],
})
export class EquipmentChoiceModule {}
