import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'example-1-epgu-long-button-component',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example1EpguLongButtonComponent {
  label = 'Текст на кнопке';
  description = 'Дополнительное описание';
  disabled = false;
  isLoading = false;
  value = 'id1';
  selectedValue = 'id1';

  isShown(value: string): boolean {
    return this.isLoading && value === this.selectedValue;
  }

  onClick() {
    this.isLoading = !this.isLoading;
  }
}
