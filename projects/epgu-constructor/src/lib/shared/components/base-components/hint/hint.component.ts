import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Clarifications } from '@epgu/epgu-constructor-types';

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
