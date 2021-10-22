import { Pipe, PipeTransform } from '@angular/core';
import { ComponentDto, FieldGroup } from '@epgu/epgu-constructor-types';
import { ConfirmUserDataState } from './confirm-personal-user-data-screen.types';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';

@Pipe({ name: 'confirmPersonalUserData' })
export class ConfirmPersonalUserDataPipe implements PipeTransform {
  public static readonly EMPTY_VALUE = '-';
  public constructor(private interpolationService: InterpolationService) {}

  public transform(componentDto: ComponentDto): ComponentDto {
    if (!componentDto?.attrs?.fieldGroups) return componentDto;

    const { fieldGroups } = componentDto.attrs;
    const { value, presetValue } = componentDto;
    const parsedValue = (presetValue
      ? JSON.parse(presetValue)
      : JSON.parse(value)) as ConfirmUserDataState;
    const states: FieldGroup[] = this.removeGroupIfEmptyFields(this.interpolationService.interpolateRecursive(
      fieldGroups,
      parsedValue.storedValues,
      ConfirmPersonalUserDataPipe.EMPTY_VALUE,
    ) as FieldGroup[]);

    return { ...componentDto, presetValue: JSON.stringify({ ...parsedValue, states }) };
  }

  private removeGroupIfEmptyFields(fieldGroups: FieldGroup[]): FieldGroup[] {
    return fieldGroups.filter(group => group.fields.some(field => field.value != ConfirmPersonalUserDataPipe.EMPTY_VALUE));
  }
}
