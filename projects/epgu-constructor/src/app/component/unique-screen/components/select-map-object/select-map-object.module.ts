import { NgModule } from '@angular/core';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';
import { BaseModule } from '../../../../shared/base.module';

const COMPONENTS = [SelectMapObjectComponent];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [Icons],
  exports: [...COMPONENTS],
  imports: [BaseModule, ConstructorLookupModule, NavigationModule],
})
export class SelectMapObjectModule {}
