import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentUniqueResolverComponent } from './component-unique-resolver.component';

@NgModule({
  declarations: [ComponentUniqueResolverComponent],
  imports: [
    CommonModule
  ],
  exports: [ComponentUniqueResolverComponent],
})
export class ComponentUniqueResolverModule {}
