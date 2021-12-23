import { NgModule } from '@angular/core';

import { ConstructorCheckboxModule } from '@epgu/epgu-constructor-ui-kit';

import { BaseModule } from '../../base.module';
import { CheckboxCubeComponent } from './checkbox-cube.component';

@NgModule({
  declarations: [CheckboxCubeComponent],
  imports: [BaseModule, ConstructorCheckboxModule],
  exports: [CheckboxCubeComponent],
})
export class CheckboxCubeModule {}
