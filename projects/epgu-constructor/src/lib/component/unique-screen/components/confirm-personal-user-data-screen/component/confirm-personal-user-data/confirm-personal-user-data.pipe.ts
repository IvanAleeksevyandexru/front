import { Pipe, PipeTransform } from '@angular/core';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ConfirmUserDataState } from '../../confirm-personal-user-data-screen.types';
import { InterpolationService } from '../../../../../../shared/services/interpolation/interpolation.service';

@Pipe({ name: 'confirmPersonalUserData' })
export class ConfirmPersonalUserDataPipe implements PipeTransform {
  constructor(private interpolationService: InterpolationService) {}

  transform(componentDto: ComponentDto): ComponentDto {
    if (!componentDto?.attrs?.fieldGroups) return componentDto;

    const { fieldGroups } = componentDto.attrs;
    const { value, presetValue } = componentDto;
    const parsedValue = (presetValue
      ? JSON.parse(presetValue)
      : JSON.parse(value)) as ConfirmUserDataState;
    const states = this.interpolationService.interpolateRecursive(
      fieldGroups,
      parsedValue.storedValues,
    );

    return { ...componentDto, presetValue: JSON.stringify({ ...parsedValue, states }) };
  }
}
