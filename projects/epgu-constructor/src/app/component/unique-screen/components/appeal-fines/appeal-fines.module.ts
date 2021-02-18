import { NgModule } from '@angular/core';
import { AppealFinesComponent } from './components/appeal-fines.component';
import { BaseModule } from '../../../../shared/base.module';
import { SubComponentsModule } from '../file-upload-screen/sub-components/sub-components.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { AppealFinesContainerComponent } from './container/appeal-fines-container.component';
// eslint-disable-next-line max-len
import { ConstructorMultilineInputModule } from '../../../../shared/components/constructor-multiline-input/constructor-multiline-input.module';

@NgModule({
  declarations: [AppealFinesComponent, AppealFinesContainerComponent],
  imports: [
    BaseModule,
    SubComponentsModule,
    DefaultUniqueScreenWrapperModule,
    ScreenPadModule,
    BaseComponentsModule,
    ConstructorMultilineInputModule,
  ],
  exports: [AppealFinesContainerComponent],
  entryComponents: [AppealFinesComponent]
})
export class AppealFinesModule {}
