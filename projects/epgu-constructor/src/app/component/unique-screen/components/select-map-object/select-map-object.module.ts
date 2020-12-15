import { NgModule } from '@angular/core';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';

const COMPONENTS = [SelectMapObjectComponent];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [Icons],
  exports: [...COMPONENTS],
  imports: [CoreModule, ConstructorLookupModule, NavigationModule],
})
export class SelectMapObjectModule {}
