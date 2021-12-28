import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseIconComponent } from '../base-icon.component';

@Component({
  selector: 'epgu-cf-ui-delete-icon',
  templateUrl: './delete-icon.component.svg',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DeleteIconComponent extends BaseIconComponent {}
