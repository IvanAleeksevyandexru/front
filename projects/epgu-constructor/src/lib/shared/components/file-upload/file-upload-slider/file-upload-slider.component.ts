import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'epgu-constructor-file-upload-slider',
  templateUrl: './file-upload-slider.component.html',
  styleUrls: ['./file-upload-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadSliderComponent {
  @Input() min?: number = 0;
  @Input() max?: number = 1;
  @Input() value: number;

  @Output() valueChange = new EventEmitter<number>();

  onSlide(value: number): void {
    this.valueChange.emit(value);
  }
}
