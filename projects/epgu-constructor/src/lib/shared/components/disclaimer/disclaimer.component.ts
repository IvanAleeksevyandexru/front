import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Clarifications } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimerComponent {
  @Input() type: string;
  @Input() title: string;
  @Input() description: string;
  @Input() clarifications: Clarifications;
  @Input() isNotifierDisclaimer = false;
}
