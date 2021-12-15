import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-zoom-in-magnifying-glass-icon',
  templateUrl: './zoom-in-magnifying-glass-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ZoomInMagnifyingGlassIconComponent extends BaseIconComponent {}
