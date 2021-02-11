import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'epgu-constructor-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  @Input() min?: number = 0;
  @Input() max?: number = 1;
  @Input() value: number;

  @Output() valueChange = new EventEmitter<number>();

  onSlide(value: number): void {
    this.valueChange.emit(value);
  }
}
