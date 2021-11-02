import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateRoutes, TuiAddonDocModule } from '@taiga-ui/addon-doc';
import { RouterModule } from '@angular/router';
import { VersionsComponent } from './versions.component';

@NgModule({
  declarations: [VersionsComponent],
  imports: [
    CommonModule,
    TuiAddonDocModule,
    RouterModule.forChild(generateRoutes(VersionsComponent)),
  ],
  exports: [VersionsComponent],
})
export class VersionsModule {}
