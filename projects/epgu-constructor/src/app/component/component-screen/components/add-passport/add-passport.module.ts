import { NgModule } from '@angular/core';
import { AddPassportContainerComponent } from './container/add-passport-component-container.component';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';
import { AddPassportComponent } from './component/add-passport.component';
import { ComponentWrapperModule } from '../../shared/component-wrapper.module';

const COMPONENTS = [AddPassportContainerComponent, AddPassportComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [BaseModule, PassportModule, ScreenPadModule, ComponentWrapperModule],
  exports: [...COMPONENTS],
  entryComponents: [AddPassportContainerComponent]
})
export class AddPassportModule {}
