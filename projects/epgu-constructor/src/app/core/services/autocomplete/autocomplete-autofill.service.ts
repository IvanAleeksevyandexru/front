import { Injectable } from '@angular/core';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ScreenService } from '../../../screen/screen.service';
import { autofillComponentsList } from './autocomplete.const';
import { ISuggestionItem } from './autocomplete.inteface';

@Injectable()
export class AutocompleteAutofillService {
  constructor(private screenService: ScreenService) {}

  public autofillIfNeeded(component): void {
    if (autofillComponentsList.includes(component?.type as UniqueScreenComponentTypes)) {
      if (component.type === UniqueScreenComponentTypes.employeeHistory) {
        const suggestions = this.screenService.suggestions[component.id];
        const cachedAnswers = this.screenService.cachedAnswers[component.id];
        if (suggestions && !cachedAnswers) {
          this.screenService.component.value = this.prepareEmployeeHistoryComponentValue(
            suggestions,
          );
          this.screenService.updateScreenStore(this.screenService);
        }
      }
    }
  }

  private prepareEmployeeHistoryComponentValue(suggestions: ISuggestionItem): string {
    return JSON.stringify(
      suggestions.list.reduce((acc, value) => {
        return [...acc, ...JSON.parse(value.originalItem)];
      }, []),
    );
  }
}
