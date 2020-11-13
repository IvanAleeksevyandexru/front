import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { SelectMapObjectService } from './select-map-object.service';
import { CoreModule } from '../../../../core/core.module';


const COMPONENTS = [
  SelectMapObjectComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [SelectMapObjectService, Icons],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
  ]
})
export class SelectMapObjectModule { }
