import { Component, Input } from '@angular/core';

enum Size {
  lg = 'lg',
}

@Component({
  selector: 'epgu-constructor-helper-text',
  templateUrl: './helper-text.component.html',
  styleUrls: ['./helper-text.component.scss'],
})
export class HelperTextComponent {
  @Input() size: Size;
}
