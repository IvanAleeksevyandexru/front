import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-camera-icon',
  templateUrl: './camera-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CameraIconComponent extends BaseIconComponent {}
