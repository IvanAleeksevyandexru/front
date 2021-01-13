import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputHtmlComponent } from './output-html.component';
import { SafeModule } from '../../pipes/safe/safe.module';
import { ImgPrefixerModule } from '../../pipes/img-prefixer/img-prefixer.module';
import { ActionModule } from '../../directives/action/action.module';

@NgModule({
  declarations: [OutputHtmlComponent],
  imports: [CommonModule, ActionModule, SafeModule, ImgPrefixerModule],
  exports: [OutputHtmlComponent],
})
export class OutputHtmlModule {}
