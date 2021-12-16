import { Component, Input } from '@angular/core';

@Component({
  template: '',
})
export class BaseIconComponent {
  @Input() color: string;
  @Input() width: number;
  @Input() height: number;
}
