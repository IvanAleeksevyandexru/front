import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-plus-icon',
  templateUrl: './plus-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PlusIconComponent extends BaseIconComponent {}
