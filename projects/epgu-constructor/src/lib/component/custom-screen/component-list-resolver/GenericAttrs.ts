import {
  ComponentPresetDto,
  ComponentRelationFieldDto,
  DefaultValue,
  Disabled,
  KeyValueMap,
  TextTransform,
} from '@epgu/epgu-constructor-types';
import { DateRangeRef } from '../../../shared/services/date-range/date-range.models';
import {
  CustomComponentAttr,
  CustomComponentAttrField,
  CustomComponentAttrValidation,
  CustomComponentRef,
  Grid,
  OnlyFirstScreen,
  Placeholder,
} from '../components-list.types';

export default class GenericAttrs {
  readonly preset: ComponentPresetDto;

  readonly defaultValue: DefaultValue;

  readonly fstuc: TextTransform;

  readonly ref: (CustomComponentRef | DateRangeRef)[];

  readonly refs?: KeyValueMap;

  readonly fields: CustomComponentAttrField;

  readonly validation: CustomComponentAttrValidation[];

  readonly relationField: ComponentRelationFieldDto;

  readonly placeholder: Placeholder;

  readonly onlyFirstScreen: OnlyFirstScreen;

  readonly grid: Grid;

  readonly disabled: Disabled;

  readonly stringsAmount: number;

  constructor(attrs: CustomComponentAttr) {
    this.preset = attrs.preset;
    this.defaultValue = attrs.defaultValue;
    this.fstuc = attrs.fstuc;
    this.ref = attrs.ref;
    this.fields = attrs.fields;
    this.validation = attrs.validation;
    this.relationField = attrs.relationField;
    this.placeholder = attrs.placeholder;
    this.onlyFirstScreen = attrs.onlyFirstScreen;
    this.refs = attrs.refs;
    this.grid = attrs.grid;
    this.disabled = attrs.disabled;
    this.stringsAmount = attrs.stringsAmount;
  }
}
