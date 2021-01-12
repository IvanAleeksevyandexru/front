import { Meta } from '@storybook/angular/types-6-0';
import {
  ButtonComponent,
  DatePickerComponent, DropdownComponent, EpguLibCommonModule,
  EpguLibModule, ListElement
} from 'epgu-lib';
import {moduleMetadata} from '@storybook/angular';

export default {
  title: 'Example/EPGU Lib',
  decorators: [
    moduleMetadata({
      imports: [
        EpguLibCommonModule,
        EpguLibModule
      ],
      schemas: [],
      declarations: [],
      providers: [],
    })
  ],
} as Meta;

export const DatePicker = (args: DatePickerComponent) => ({
  // @todo. если использовать component вместо template будет "Type DatePickerComponent is part of
  // the declarations of 2 modules: EpguLibModule and DynamicModule!". Похоже что-то не так с EpguLibModule
  // component: DatePickerComponent,
  template: '<lib-date-picker [ngModel]="value" [minDate]="minDate" [maxDate]="maxDate"></lib-date-picker>',
  props: args,
});
DatePicker.args = {
  minDate: '-3d',
  maxDate: '+3d',
  clearable: true,
  value: new Date()
};

const listItems: ListElement[] = [
  {
    id: 'id1',
    text: 'option 1'
  },
  {
    id: 'id2',
    text: 'option 2'
  },
  {
    id: 'id3',
    text: 'option 3'
  },
];
export const Dropdown = (args: DropdownComponent) => ({
  template: `
    <lib-dropdown
      [invalid]="invalid"
      [items]="items"
      [disabled]="disabled"
      [clearable]="true"
      [localSearch]="localSearch"
      [multi]="multi"
      [ngModel]="value"
    >
    </lib-dropdown>
  `,
  props: args
});
Dropdown.args = {
  invalid: false,
  items: listItems,
  disabled: false,
  clearable: true,
  localSearch: false,
  multi: false,
  value: 'id2'
};
Dropdown.argTypes = {
  value: {
    control: {
      type: 'select',
      options: listItems.map(item => item.id),
    }
  },
};

export const Button = (args: ButtonComponent) => ({
  template: `
    <lib-button
      [type]="type"
      [size]="size"
      [fontSize]="fontSize"
      [color]="color"
      [width]="width"
      [height]="height"
      [disabled]="disabled"
      [link]="link"
      [target]="target"
      [internalLink]="internalLink"
      [showLoader]="showLoader"
      (click)="onClick($event)"
    >
        {{value}}
    </lib-button>
  `,
  props: args
});
Button.args = {
  type: 'button',
  size: '',
  fontSize: null,
  color: '',
  width: '',
  height: '',
  disabled: false,
  link: '',
  target: '',
  internalLink: '',
  showLoader: false,
  value: 'Submit',
};
Button.argTypes = {
  color: {
    control: {
      type: 'select',
      options: ['white', 'transparent', ''],
    }
  },
  fontSize: { control: 'number' },
  type: {
    control: {
      type: 'select',
      options: ['button', 'anchor', 'search'],
    }
  },
  size: {
    control: {
      type: 'select',
      options: ['md', 'lg', ''],
    }
  },
  width: {
    control: {
      type: 'select',
      options: ['wide', ''],
    }
  },
  height: {
    control: {
      type: 'select',
      options: ['dynamic', ''],
    }
  },
  onClick: { action: 'clicked' }
};

