import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';


const COMPONENTS = [
  SelectMapObjectComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [Icons],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    ConstructorLookupModule,
  ]
})
export class SelectMapObjectModule { }
