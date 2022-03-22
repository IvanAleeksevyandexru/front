import { ILinkedValue, KeyValueMap } from '@epgu/epgu-constructor-types';
import { AbstractControl } from '@angular/forms';
import { CustomComponent, CustomScreenComponentTypes } from '../components-list.types';
import { ScreenStore } from '../../../screen/screen.types';

export default abstract class BaseModel<T> {
  readonly id: string;

  readonly type: CustomScreenComponentTypes;

  readonly label: string;

  readonly attrs: T;

  readonly required: boolean;

  readonly visited: boolean;

  readonly presetValue?: string;

  readonly valueFromCache?: boolean;

  readonly suggestionId?: string;

  readonly arguments?: KeyValueMap;

  readonly linkedValues?: ILinkedValue[];

  value: string;

  constructor(componentDto: CustomComponent) {
    this.attrs = this.getAttrs(componentDto.attrs);
    this.id = componentDto.id;
    this.label = componentDto.label;
    this.required = componentDto.required;
    this.visited = componentDto.visited;
    this.presetValue = componentDto.presetValue;
    this.valueFromCache = componentDto.valueFromCache;
    this.suggestionId = componentDto.suggestionId;
    this.arguments = componentDto.arguments;
    this.linkedValues = componentDto.linkedValues;
    this.value = componentDto.value;
  }

  get isResultEmpty(): boolean {
    return false;
  }

  public hasAtLeastOne(_: CustomComponent): boolean {
    return false;
  }

  public patchControlValue(_: AbstractControl, __: ScreenStore): boolean {
    return false;
  }

  public asObject(): CustomComponent {
    return {
      attrs: this.attrs,
      id: this.id,
      type: this.type,
      label: this.label,
      required: this.required,
      visited: this.visited,
      presetValue: this.presetValue,
      valueFromCache: this.valueFromCache,
      suggestionId: this.suggestionId,
      arguments: this.arguments,
      linkedValues: this.linkedValues,
      value: this.value,
    };
  }

  abstract getAttrs(attrs: unknown): T;
}
