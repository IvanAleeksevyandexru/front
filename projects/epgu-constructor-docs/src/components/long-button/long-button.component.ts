import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import exampleImportModule from '!!raw-loader!./examples/import/import-module.txt';
import exampleInsertTemplate from '!!raw-loader!./examples/import/insert-template.html';

import example1Ts from '!!raw-loader!./examples/1/index.ts';
import example1Html from '!!raw-loader!./examples/1/index.html';
import example1Scss from '!!raw-loader!./examples/1/index.scss';

import example2Ts from '!!raw-loader!./examples/2/index.ts';
import example2Html from '!!raw-loader!./examples/2/index.html';
import example2Scss from '!!raw-loader!./examples/2/index.scss';

@Component({
  selector: 'example-long-button',
  templateUrl: './long-button.component.html',
  styleUrls: ['./long-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleEpguLongButtonComponent implements OnInit {
  readonly exampleImportModule = exampleImportModule;
  readonly exampleInsertTemplate = exampleInsertTemplate;

  readonly example1 = {
    TypeScript: example1Ts,
    HTML: example1Html,
    SCSS: example1Scss,
  };

  readonly example2 = {
    TypeScript: example2Ts,
    HTML: example2Html,
    SCSS: example2Scss,
  };

  readonly header = 'Long Button';
  readonly package = 'base';
  readonly type = 'component';
  readonly example1Description = 'Базовое поведение кнопки';

  readonly label = 'Текст на кнопке';
  readonly description = 'Дополнительное описание';
  readonly disabled = false;
  readonly isLoading = false;
  readonly value = 'id1';
  selectedValue = 'id1';

  readonly labels = ['Первая кнопка', 'Вторая кнопка'];
  readonly values = ['id1', 'id2'];
  readonly descriptions = ['', 'Описание ко второй кнопке'];
  readonly disables = [false, false];
  readonly isLoadings = [false, false];

  ngOnInit(): void {}

  isShown(value: string): boolean {
    return this.isLoading && value === this.selectedValue;
  }

  handleClick(value): void {
    this.selectedValue = value;
  }
}
