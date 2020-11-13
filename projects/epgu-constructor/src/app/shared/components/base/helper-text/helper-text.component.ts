import { Component, Input } from '@angular/core';

enum Size {
  sm = 'sm',
  lg = 'lg',
}

@Component({
  selector: 'epgu-constructor-helper-text',
  templateUrl: './helper-text.component.html',
  styleUrls: ['./helper-text.component.scss'],
})
export class HelperTextComponent {
  @Input() size: Size = Size.lg;
  @Input() color: Size = Size.lg;
}
