import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Clarifications } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent {
  @Input() hint: string;
  @Input() clarifications: Clarifications;
}
