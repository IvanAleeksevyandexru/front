import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { ChipModule } from '@epgu/epgu-constructor-ui-kit';
import { ExampleEpguChipComponent } from './chip.component';
import { Example1EpguChipComponent } from './examples/1';

@NgModule({
  declarations: [ExampleEpguChipComponent, Example1EpguChipComponent],
  imports: [
    CommonModule,
    TuiAddonDocModule,
    ChipModule,
    RouterModule.forChild(generateRoutes(ExampleEpguChipComponent)),
  ],
  exports: [ExampleEpguChipComponent],
})
export class ExampleEpguChipModule {}
