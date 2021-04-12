import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentResolverComponent } from './component-resolver.component';

@NgModule({
  declarations: [ComponentResolverComponent],
  imports: [
    CommonModule
  ],
  exports: [ComponentResolverComponent],
})
export class ComponentResolverModule {}
