import { NgModule } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { CachedAnswersService } from '../../../../shared/services/applicant-answers/cached-answers.service';
import { SharedModule } from '../../../../shared/shared.module';
import { SelectChildrenScreenComponent } from './select-children-screen.component';
import { ComponentsListModule } from '../../../components-list/components-list.module';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { BaseModule } from '../../../../shared/components/base/base.module';

const COMPONENTS = [SelectChildrenScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CoreModule, SharedModule, ComponentsListModule, ConstructorDropdownModule, BaseModule],
  exports: [...COMPONENTS],
  providers: [ScreenService, CachedAnswersService],
})
export class SelectChildrenScreenModule {}
