import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputHtmlComponent } from './output-html.component';
import { SafeModule } from '@epgu/epgu-constructor-ui-kit';
import { ImgPrefixerModule } from '@epgu/epgu-constructor-ui-kit';
import { ActionModule } from '../../directives/action/action.module';
import { ClickableLabelModule } from '../../directives/clickable-label/clickable-label.module';
import { TableModule } from '../../directives/table/table.module';

@NgModule({
  declarations: [OutputHtmlComponent],
  imports: [CommonModule, ActionModule, SafeModule, ImgPrefixerModule, ClickableLabelModule, TableModule],
  exports: [OutputHtmlComponent],
})
export class OutputHtmlModule {}
