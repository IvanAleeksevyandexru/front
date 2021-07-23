import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import exampleImportModule from '!!raw-loader!./examples/import/import-module.txt';
import exampleInsertTemplate from '!!raw-loader!./examples/import/insert-template.html';

import example1Ts from '!!raw-loader!./examples/1/index.ts';
import example1Html from '!!raw-loader!./examples/1/index.html';

@Component({
  selector: 'example-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleEpguCheckboxComponent implements OnInit {
  readonly exampleImportModule = exampleImportModule;
  readonly exampleInsertTemplate = exampleInsertTemplate;

  readonly example1 = {
    TypeScript: example1Ts,
    HTML: example1Html,
  };

  readonly header = 'Checkbox';
  readonly package = 'base';
  readonly type = 'component';

  readonly checkboxId = 'id1';
  readonly labelText = 'Сопроводительный текст-лейбл';
  readonly control = new FormControl();
  readonly isLoading = false;
  readonly required = true;
  readonly hidden = false;
  set disabled(value) {
    if (value) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  ngOnInit(): void {}

  handleClick(event): void {
    if (event.target.id) {
      alert(`${event.target.id}, ${event.target.checked}`);
    }
  }
}
