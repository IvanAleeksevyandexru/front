import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentResolverComponent } from './component-resolver.component';
import { ComponentScreenComponentsModule } from '../component-screen/component-screen-components.module';
import { UniqueScreenComponentsModule } from '../unique-screen/unique-screen-components.module';

@NgModule({
  declarations: [ComponentResolverComponent],
  imports: [
    CommonModule,
    ComponentScreenComponentsModule,
    UniqueScreenComponentsModule
  ],
  exports: [ComponentResolverComponent],
})
export class ComponentResolverModule {}
