import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionDirective } from './action.directive';
import { ActionService } from './action.service';

@NgModule({
  declarations: [ActionDirective],
  imports: [CommonModule],
  exports: [ActionDirective],
  providers: [ActionService]
})
export class ActionModule {}
