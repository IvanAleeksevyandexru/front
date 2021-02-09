import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentResolverComponent } from './component-resolver.component';
import { UniqueScreenComponentsModule } from '../unique-screen/unique-screen-components.module';

@NgModule({
  declarations: [ComponentResolverComponent],
  imports: [
    CommonModule,
    UniqueScreenComponentsModule
  ],
  exports: [ComponentResolverComponent],
})
export class ComponentResolverModule {}
