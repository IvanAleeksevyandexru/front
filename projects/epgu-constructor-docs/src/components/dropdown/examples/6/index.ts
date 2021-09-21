import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ListElement } from '@epgu/ui/models/dropdown';

@Component({
  selector: 'example-6-epgu-dropdown-component',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example6EpguDropdownComponent {
  readonly id = '123';
  readonly control: AbstractControl = new FormControl();
  readonly invalid = false;
  readonly validationShowOn = ValidationShowOn.IMMEDIATE;
  readonly clearable = false;
  readonly disabled = true;
  readonly localSearch = false;
  readonly placeholder = '&mdash;';
  readonly items: ListElement[] = [
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
  ];

  handleSelect(event): void {
    if (event?.id) {
      console.log(`${event?.id}, ${event?.text}`);
    } else {
      console.log(event);
    }
  }
}
