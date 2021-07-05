import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'example-1-epgu-helper-text-component',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example1EpguHelperTextComponent {
  sizes = ['', 'lg'];
  content = ['Текст подсказки', 'Текст увеличенной подсказки'];
}
