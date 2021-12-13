import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { BaseComponentsModule } from '@epgu/epgu-constructor-ui-kit';
import { ExampleEpguHelperTextComponent } from './helper-text.component';
import { Example1EpguHelperTextComponent } from './examples/1';

@NgModule({
  declarations: [ExampleEpguHelperTextComponent, Example1EpguHelperTextComponent],
  imports: [
    CommonModule,
    TuiAddonDocModule,
    BaseComponentsModule,
    RouterModule.forChild(generateRoutes(ExampleEpguHelperTextComponent)),
  ],
  exports: [ExampleEpguHelperTextComponent],
})
export class ExampleEpguHelperTextModule {}
