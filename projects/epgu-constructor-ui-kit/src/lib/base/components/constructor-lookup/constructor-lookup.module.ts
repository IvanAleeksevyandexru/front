import { NgModule } from '@angular/core';

import { ConstructorLookupComponent } from './constructor-lookup.component';
import { BaseUiModule } from '../../base-ui.module';

@NgModule({
  declarations: [ConstructorLookupComponent],
  imports: [BaseUiModule],
  exports: [ConstructorLookupComponent]
})
export class ConstructorLookupModule {}
