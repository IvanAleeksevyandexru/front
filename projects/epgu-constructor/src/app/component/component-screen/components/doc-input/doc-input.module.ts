import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { DocInputComponent } from './doc-input.component';
import { CoreModule } from '../../../../core/core.module';

const COMPONENTS = [ DocInputComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CoreModule,
    SharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class DocInputModule { }
