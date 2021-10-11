import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { SelectMapObjectModule } from '../select-map-object/select-map-object.module';
import { KindergartenComponent } from './kindergarten.component';

@NgModule({
  declarations: [KindergartenComponent],
  exports: [KindergartenComponent],
  imports: [BaseModule, SelectMapObjectModule],
  entryComponents: [KindergartenComponent],
})
export class KindergartenModule {}
