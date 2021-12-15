import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-copy-icon',
  templateUrl: './copy-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CopyIconComponent extends BaseIconComponent {}
