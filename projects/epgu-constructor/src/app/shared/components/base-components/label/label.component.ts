import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Clarifications } from 'epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  @Input() for: string;
  @Input() required: boolean;
  @Input() tips: string;
  @Input() isTextHelper: boolean;
  @Input() label: string;
  @Input() clarifications: Clarifications;
  @Input() largeFontSize: boolean;
}
