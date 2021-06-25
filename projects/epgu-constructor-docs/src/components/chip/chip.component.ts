import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import exampleImportModule from '!!raw-loader!./examples/import/import-module.txt';
import exampleInsertTemplate from '!!raw-loader!./examples/import/insert-template.html';

import example1Ts from '!!raw-loader!./examples/1/index.ts';
import example1Html from '!!raw-loader!./examples/1/index.html';

@Component({
  selector: 'example-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleEpguChipComponent implements OnInit {
  readonly exampleImportModule = exampleImportModule;
  readonly exampleInsertTemplate = exampleInsertTemplate;

  readonly example1 = {
    TypeScript: example1Ts,
    HTML: example1Html,
  };

  readonly header = 'Сhip';
  readonly description = 'description';
  readonly package = 'base';
  readonly type = 'component';

  readonly label = 'label';
  readonly id = 'id';

  public onClose(id): void {
    alert(id);
  }

  ngOnInit(): void {}
}
