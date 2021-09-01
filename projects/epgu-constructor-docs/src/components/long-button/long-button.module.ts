import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { ExampleEpguLongButtonComponent } from './long-button.component';
import { Example1EpguLongButtonComponent } from './examples/1';
import { Example2EpguLongButtonComponent } from './examples/2';
import { BaseUiModule, LongButtonModule } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [
    ExampleEpguLongButtonComponent,
    Example1EpguLongButtonComponent,
    Example2EpguLongButtonComponent,
  ],
  imports: [
    CommonModule,
    TuiAddonDocModule,
    LongButtonModule,
    BaseUiModule,
    RouterModule.forChild(generateRoutes(ExampleEpguLongButtonComponent)),
  ],
  exports: [ExampleEpguLongButtonComponent],
})
export class ExampleEpguLongButtonModule {}
