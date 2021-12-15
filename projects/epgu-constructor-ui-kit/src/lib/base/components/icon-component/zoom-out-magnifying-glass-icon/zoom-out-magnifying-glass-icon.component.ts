import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-zoom-out-magnifying-glass-icon',
  templateUrl: './zoom-out-magnifying-glass-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ZoomOutMagnifyingGlassIconComponent extends BaseIconComponent {}
