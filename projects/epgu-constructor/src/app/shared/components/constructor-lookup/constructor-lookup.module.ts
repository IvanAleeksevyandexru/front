import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorLookupComponent } from './constructor-lookup.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorLookupComponent],
  imports: [CommonModule, CoreModule],
  exports: [
    ConstructorLookupComponent
  ]
})
export class ConstructorLookupModule {}
