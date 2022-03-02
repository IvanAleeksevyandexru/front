import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, LayoutComponent],
  exports: [LayoutComponent],
  imports: [CommonModule, RouterModule],
})
export class LayoutModule {}
