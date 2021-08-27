import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionDirective } from './action.directive';
import { ActionService } from './action.service';
import { ActionToolsService } from './action-tools.service';

@NgModule({
  declarations: [ActionDirective],
  imports: [CommonModule],
  exports: [ActionDirective],
  providers: [ActionService, ActionToolsService],
})
export class ActionModule {}
