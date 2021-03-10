import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { RepeatableFieldsComponent } from './repeatable-fields.component';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { ComponentsListModule } from '../../../../shared/components/components-list/components-list.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';

@NgModule({
  declarations: [RepeatableFieldsComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ComponentsListModule,
    CloneButtonModule,
  ],
  exports: [RepeatableFieldsComponent],
  entryComponents: [RepeatableFieldsComponent]
})
export class RepeatableFieldsModule {}
