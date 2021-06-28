import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'example-1-epgu-chip-component',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example1EpguChipComponent {
  labels = ['Привет', 'Плашка', 'Плашка с длинным текстом, содержащим например адрес'];
  ids = ['id1', 'id2', 'id3'];

  onClose(id): void {
    alert(id);
  }
}
