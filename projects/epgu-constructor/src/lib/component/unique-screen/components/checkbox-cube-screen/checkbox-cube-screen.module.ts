import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';

import { BaseModule } from '../../../../shared/base.module';
import { CheckboxCubeModule } from '../../../../shared/components/checkbox-cube/checkbox-cube.module';
import { CheckboxCubeScreenComponent } from './checkbox-cube-screen.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

@NgModule({
  declarations: [CheckboxCubeScreenComponent],
  imports: [
    BaseModule,
    CheckboxCubeModule,
    CommonModule,
    DefaultUniqueScreenWrapperModule,
    ScreenPadModule,
  ],
  exports: [CheckboxCubeScreenComponent],
})
export class CheckboxCubeScreenModule {}
