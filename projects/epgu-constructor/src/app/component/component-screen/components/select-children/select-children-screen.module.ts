import { NgModule } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { SelectChildrenScreenComponent } from './select-children-screen.component';
import { ComponentsListModule } from '../../../components-list/components-list.module';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';

const COMPONENTS = [SelectChildrenScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CoreModule, ComponentsListModule, ConstructorDropdownModule, BaseModule, CloneButtonModule],
  exports: [...COMPONENTS],
  providers: [ScreenService, CachedAnswersService],
})
export class SelectChildrenScreenModule {}
