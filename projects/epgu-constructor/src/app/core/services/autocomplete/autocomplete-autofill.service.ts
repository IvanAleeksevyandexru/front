import { Injectable } from '@angular/core';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ScreenService } from '../../../screen/screen.service';
import { autofillComponentsList } from './autocomplete.const';

@Injectable()
export class AutocompleteAutofillService {
  constructor(private screenService: ScreenService) {}

  public autofillIfNeeded(component): void {
    if (autofillComponentsList.includes(component?.type as UniqueScreenComponentTypes)) {
      if (component.type === UniqueScreenComponentTypes.employeeHistory) {
        this.screenService.component.value = this.prepareEmployeeHistoryComponentValue(component);
        this.screenService.updateScreenStore(this.screenService);
      }
    }
  }

  private prepareEmployeeHistoryComponentValue(component: ComponentDto): string {
    return JSON.stringify(
      this.screenService.suggestions[component.id].list.reduce((acc, value) => {
        return [...acc, ...JSON.parse(value.originalItem)];
      }, []),
    );
  }
}
