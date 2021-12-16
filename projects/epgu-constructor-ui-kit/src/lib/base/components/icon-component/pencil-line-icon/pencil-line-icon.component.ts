import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-pencil-line-icon',
  templateUrl: './pencil-line-icon.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PencilLineIconComponent extends BaseIconComponent {}
