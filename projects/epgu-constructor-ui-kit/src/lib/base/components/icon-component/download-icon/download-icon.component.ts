import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-download-icon',
  templateUrl: './download-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DownloadIconComponent extends BaseIconComponent {}
