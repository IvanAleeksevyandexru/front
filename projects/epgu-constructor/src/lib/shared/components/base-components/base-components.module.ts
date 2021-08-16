import { NgModule } from '@angular/core';
import { PageNameComponent } from './page-name/page-name.component';
import { LabelComponent } from './label/label.component';
import { BaseModule } from '../../base.module';
import { ClickableLabelModule } from '../../directives/clickable-label/clickable-label.module';
import { HintComponent } from './hint/hint.component';
import { BaseComponentsModule as BaseComponentsUiKitModule } from '@epgu/epgu-constructor-ui-kit';
import { UserInfoLoaderModule } from '../user-info-loader/user-info-loader.module';

@NgModule({
  declarations: [PageNameComponent, LabelComponent, HintComponent],
  imports: [BaseComponentsUiKitModule, BaseModule, ClickableLabelModule, UserInfoLoaderModule],
  exports: [BaseComponentsUiKitModule, PageNameComponent, LabelComponent, HintComponent],
})
export class BaseComponentsModule {}
