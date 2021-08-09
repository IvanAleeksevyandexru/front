import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CycledInfo } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-cycled-info',
  templateUrl: './cycled-info.component.html',
  styleUrls: ['./cycled-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CycledInfoComponent {
  @Input() value: CycledInfo[];
}
