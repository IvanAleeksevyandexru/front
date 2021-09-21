/* eslint-disable no-console */
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ListElement } from '@epgu/ui/models/dropdown';

import exampleImportModule from '!!raw-loader!./examples/import/import-module.txt';
import exampleInsertTemplate from '!!raw-loader!./examples/import/insert-template.html';

import example1Ts from '!!raw-loader!./examples/1/index.ts';
import example1Html from '!!raw-loader!./examples/1/index.html';

import example2Ts from '!!raw-loader!./examples/2/index.ts';
import example2Html from '!!raw-loader!./examples/2/index.html';

import example3Ts from '!!raw-loader!./examples/3/index.ts';
import example3Html from '!!raw-loader!./examples/3/index.html';

import example4Ts from '!!raw-loader!./examples/4/index.ts';
import example4Html from '!!raw-loader!./examples/4/index.html';

import example5Ts from '!!raw-loader!./examples/5/index.ts';
import example5Html from '!!raw-loader!./examples/5/index.html';

import example6Ts from '!!raw-loader!./examples/6/index.ts';
import example6Html from '!!raw-loader!./examples/6/index.html';

@Component({
  selector: 'example-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleEpguDropdownComponent implements OnInit {
  readonly exampleImportModule = exampleImportModule;
  readonly exampleInsertTemplate = exampleInsertTemplate;

  readonly example1 = {
    TypeScript: example1Ts,
    HTML: example1Html,
  };

  readonly example2 = {
    TypeScript: example2Ts,
    HTML: example2Html,
  };

  readonly example3 = {
    TypeScript: example3Ts,
    HTML: example3Html,
  };

  readonly example4 = {
    TypeScript: example4Ts,
    HTML: example4Html,
  };

  readonly example5 = {
    TypeScript: example5Ts,
    HTML: example5Html,
  };

  readonly example6 = {
    TypeScript: example6Ts,
    HTML: example6Html,
  };

  readonly header = 'Dropdown';
  readonly package = 'base';
  readonly type = 'component';

  readonly id = '123';
  readonly control = new FormControl();
  readonly invalid = false;
  readonly validationShowOn = ValidationShowOn.IMMEDIATE;
  readonly clearable = false;
  readonly disabled = false;
  readonly localSearch = true;
  readonly placeholder = '&mdash;';
  readonly itemsVariants: ListElement[][] = [
    [
      {
        id: 1,
        text: 'Первый пункт',
      },
      {
        id: 2,
        text: 'Вторая опция',
      },
      {
        id: 3,
        text: 'Третий вариант',
      },
    ],
    [
      {
        id: 1,
        text: '1 длинный содержательный пункт с дополнительным текстовым описанием',
      },
      {
        id: 2,
        text: '2 длинный содержательный пункт с дополнительным текстовым описанием',
      },
      {
        id: 3,
        text: '3 длинный содержательный пункт с дополнительным текстовым описанием',
      },
    ],
  ];
  readonly items: ListElement[] = this.itemsVariants[0];

  ngOnInit(): void {}

  handleSelect(event): void {
    if (event?.id) {
      console.log(`${event?.id}, ${event?.text}`);
    } else {
      console.log(event);
    }
  }
}
