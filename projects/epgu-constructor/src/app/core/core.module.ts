import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { OutputHtmlComponent } from './components/output-html/output-html.component';
import { ImgPrefixerPipe } from './pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from './pipes/safe/safe.pipe';

export const EpguLibModuleInited = EpguLibModule.forRoot();

const COMPONENTS = [
  OutputHtmlComponent
];

const PIPES = [
  ImgPrefixerPipe,
  SafePipe
];


/**
 * Домен ядра. Сдесь храниться всё что необходимо во всех слоях.
 */
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpguLibModuleInited,
    PerfectScrollbarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpguLibModule,
    PerfectScrollbarModule,
    ...COMPONENTS,
    ...PIPES
  ]
})
export class CoreModule {}
