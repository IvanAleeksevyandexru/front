import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import exampleImportModule from '!!raw-loader!./examples/import/import-module.txt';
import exampleInsertTemplate from '!!raw-loader!./examples/import/insert-template.html';

import example1Ts from '!!raw-loader!./examples/1/index.ts';
import example1Html from '!!raw-loader!./examples/1/index.html';

@Component({
  selector: 'example-helper-text',
  templateUrl: './helper-text.component.html',
  styleUrls: ['./helper-text.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleEpguHelperTextComponent implements OnInit {
  readonly exampleImportModule = exampleImportModule;
  readonly exampleInsertTemplate = exampleInsertTemplate;

  readonly example1 = {
    TypeScript: example1Ts,
    HTML: example1Html,
  };

  readonly header = 'Helper Text';
  readonly package = 'base';
  readonly type = 'component';

  readonly size = 'lg';
  readonly sizeVariants = [null, 'lg'];
  readonly content = 'Некоторый текст подсказки';

  ngOnInit(): void {}
}
