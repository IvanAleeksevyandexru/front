import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { ExampleEpguCheckboxComponent } from './checkbox.component';
import { Example1EpguCheckboxComponent } from './examples/1';
import { ConstructorCheckboxModule } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [ExampleEpguCheckboxComponent, Example1EpguCheckboxComponent],
  imports: [
    CommonModule,
    TuiAddonDocModule,
    ConstructorCheckboxModule,
    RouterModule.forChild(generateRoutes(ExampleEpguCheckboxComponent)),
  ],
  exports: [ExampleEpguCheckboxComponent],
})
export class ExampleEpguCheckboxModule {}
