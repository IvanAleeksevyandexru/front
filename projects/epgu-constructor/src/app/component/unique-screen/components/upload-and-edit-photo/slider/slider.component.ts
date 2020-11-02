import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'epgu-constructor-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  @Input() min?: number = 0;
  @Input() max?: number = 1;
  @Input() value: number;

  @Output() valueChange = new EventEmitter();

  onSlide(value: number): void {
    this.valueChange.emit(value);
  }
}