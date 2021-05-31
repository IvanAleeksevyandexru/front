import { NgModule } from '@angular/core';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { ConstructorLookupModule } from '@epgu/epgu-constructor-ui-kit';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [SelectMapObjectComponent],
  providers: [Icons],
  exports: [SelectMapObjectComponent],
  imports: [BaseModule, ConstructorLookupModule, NavigationModule],
  entryComponents:[SelectMapObjectComponent]
})
export class SelectMapObjectModule {}
