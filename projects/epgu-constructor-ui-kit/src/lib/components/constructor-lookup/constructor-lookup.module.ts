import { NgModule } from '@angular/core';

import { ConstructorLookupComponent } from './constructor-lookup.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorLookupComponent],
  imports: [BaseModule],
  exports: [ConstructorLookupComponent]
})
export class ConstructorLookupModule {}
