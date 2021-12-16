import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-video-icon',
  templateUrl: './video-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoIconComponent extends BaseIconComponent {}
