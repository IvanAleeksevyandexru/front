import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClarificationsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { Checkbox } from '../models/checkbox-cube.interface';

@Component({
  selector: 'epgu-constructor-checkbox-cube',
  templateUrl: './checkbox-cube.component.html',
  styleUrls: ['./checkbox-cube.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxCubeComponent {
  @Input() clarifications: ClarificationsDto;
  @Input() label: string;
  @Input() formGroup: FormGroup;
  @Input() checkboxes: Checkbox[];
}
