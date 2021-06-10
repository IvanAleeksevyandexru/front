import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-cf-ui-constructor-helper-text',
  templateUrl: './helper-text.component.html',
  styleUrls: ['./helper-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelperTextComponent {
  @Input() size: 'lg';
}
