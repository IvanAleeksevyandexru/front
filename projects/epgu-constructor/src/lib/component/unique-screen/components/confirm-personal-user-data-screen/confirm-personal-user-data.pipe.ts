import { Pipe, PipeTransform } from '@angular/core';
import { ComponentDto, ComponentFieldDto, FieldGroup } from '@epgu/epgu-constructor-types';
import { ConfirmUserDataState } from './confirm-personal-user-data-screen.types';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';
import { DEFAULT_FIELD_LIST } from './component/confirm-personal-user-data/default-field-list';

@Pipe({ name: 'confirmPersonalUserData' })
export class ConfirmPersonalUserDataPipe implements PipeTransform {
  public static readonly EMPTY_VALUE = '-';

  public constructor(private interpolationService: InterpolationService) {}

  public transform(componentDto: ComponentDto): ComponentDto {
    const { value, presetValue } = componentDto;
    const parsedValue = (presetValue
      ? JSON.parse(presetValue)
      : JSON.parse(value)) as ConfirmUserDataState;
    let fieldGroups: FieldGroup[];
    const { keepVariables = true } = componentDto.attrs;
    if (!componentDto?.attrs?.fieldGroups) {
      fieldGroups = DEFAULT_FIELD_LIST;
      this.removeFieldsOutsideJson(componentDto.attrs.fields, fieldGroups);
    } else {
      fieldGroups = componentDto.attrs.fieldGroups;
    }

    const states: FieldGroup[] = this.removeGroupIfFieldsEmptyOrWithoutValue(
      this.interpolationService.interpolateRecursive(
        fieldGroups,
        parsedValue.storedValues,
        ConfirmPersonalUserDataPipe.EMPTY_VALUE,
        keepVariables,
      ) as FieldGroup[],
    );

    return { ...componentDto, presetValue: JSON.stringify({ ...parsedValue, states }) };
  }

  private removeGroupIfFieldsEmptyOrWithoutValue(fieldGroups: FieldGroup[]): FieldGroup[] {
    return fieldGroups.filter((group) =>
      group.fields.some(
        (field) =>
          !field.value.match(this.interpolationService.variableRegExp) &&
          field.value != ConfirmPersonalUserDataPipe.EMPTY_VALUE,
      ),
    );
  }

  private removeFieldsOutsideJson(dtoFields: ComponentFieldDto[], fieldGroups: FieldGroup[]): void {
    fieldGroups.forEach((fieldGroup) => {
      fieldGroup.fields = fieldGroup.fields.filter((field) => {
        return dtoFields.findIndex((dtoField) => dtoField.fieldName === field.fieldName) !== -1;
      });
    });
  }
}
