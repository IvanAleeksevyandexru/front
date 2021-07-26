import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { ExampleEpguDropdownComponent } from './dropdown.component';
import { Example1EpguDropdownComponent } from './examples/1';
import { Example2EpguDropdownComponent } from './examples/2';
import { Example3EpguDropdownComponent } from './examples/3';
import { Example4EpguDropdownComponent } from './examples/4';
import { Example5EpguDropdownComponent } from './examples/5';
import { Example6EpguDropdownComponent } from './examples/6';
import { ConstructorDropdownModule } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [
    ExampleEpguDropdownComponent,
    Example1EpguDropdownComponent,
    Example2EpguDropdownComponent,
    Example3EpguDropdownComponent,
    Example4EpguDropdownComponent,
    Example5EpguDropdownComponent,
    Example6EpguDropdownComponent,
  ],
  imports: [
    CommonModule,
    TuiAddonDocModule,
    ConstructorDropdownModule,
    RouterModule.forChild(generateRoutes(ExampleEpguDropdownComponent)),
  ],
  exports: [ExampleEpguDropdownComponent],
})
export class ExampleEpguDropdownModule {}
