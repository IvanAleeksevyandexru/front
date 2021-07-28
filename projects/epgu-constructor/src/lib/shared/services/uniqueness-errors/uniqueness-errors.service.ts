import { Injectable } from '@angular/core';
import { ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService, UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';

const isSameValue = (compValue, value): boolean => {
  if (typeof compValue === 'string') {
    return compValue === value;
  } else {
    return Object.keys(compValue).every((fieldId: string) => {
      if (typeof compValue[fieldId] !== undefined) {
        return compValue[fieldId] === value[fieldId];
      }
      return true;
    });
  }
};
@Injectable()
export class UniquenessErrorsService {
  private _preparedUniquenessErrors: ScenarioErrorsDto[];
  get preparedUniquenessErrors(): ScenarioErrorsDto[] {
    return this._preparedUniquenessErrors;
  }

  private _initErrors: ScenarioErrorsDto[][] = [];
  private _initValues: Array<Record<string, string>> = [];
  private _componendIdErrorsMap: Record<string, number[][]> = {};

  constructor(private screenService: ScreenService, private ngUnsubscribe$: UnsubscribeService) {}

  public init(): void {
    this.screenService.uniquenessErrors$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((uniquenessErrors) => {
        if (uniquenessErrors.length) {
          this._initErrors = [...uniquenessErrors] || [];
          this._componendIdErrorsMap = this.getComponentIdErrorsMap();
          this._initValues = this.getState();
          this._preparedUniquenessErrors = this.prepareUniquenessErrors(uniquenessErrors);
          this.triggerComponentErrorsUpdate();
        }
      });
  }

  public calculatePreparedUniqErrors(changes: Array<Record<string, string>>, index: number): void {
    if (!changes || !this._initErrors.length) return;

    const initComponent = this._initValues[index];
    const initErrors = this._initErrors[index];

    if (initComponent && initErrors) {
      initErrors.forEach((error: Record<string, string> | null, errorIndex: number): void => {
        let componentIdWithError: string;
        const isOneErrorFixed =
          error &&
          Object.keys(error).some((componentId: string): boolean => {
            componentIdWithError = componentId;
            const initValue = initComponent[componentId];
            const changedValue = changes[index][componentId];
            return !isSameValue(changedValue, initValue);
          });

        if (isOneErrorFixed) {
          initErrors[errorIndex] = null;
          const componendIdMapped = Object.keys(this._componendIdErrorsMap).find((componentId) =>
            componentId.includes(componentIdWithError),
          );
          this._componendIdErrorsMap[componendIdMapped][index] = null;
          this.removeLastDuplicateError(componendIdMapped);
          setTimeout(() => {
            this._preparedUniquenessErrors = this.prepareUniquenessErrors(this._initErrors);
            this.triggerComponentErrorsUpdate();
          });
        }
      });
    }
  }

  private getComponentIdErrorsMap(): Record<string, number[][]> {
    return this._initErrors.reduce((acc, errors, currentIndex): Record<string, number[][]> => {
      errors.forEach((error, index) => {
        const componentsIdsJoined = Object.keys(error).join('.');
        if (acc[componentsIdsJoined]) {
          acc[componentsIdsJoined].push([currentIndex, index]);
        } else {
          acc[componentsIdsJoined] = [[currentIndex, index]];
        }
      });
      return acc;
    }, {});
  }

  private removeLastDuplicateError(componentId: string): void {
    const actualErrorsMap = this._componendIdErrorsMap[componentId].filter((error) => error);
    if (actualErrorsMap.length === 1) {
      const [firstIndex, secondIndex] = actualErrorsMap[0];
      this._initErrors[firstIndex][secondIndex] = null;
    }
  }

  private getState(): Array<Record<string, string>> {
    const cachedAnswers = this.screenService.cachedAnswers[this.screenService.component.id];
    if (cachedAnswers && UtilsService.hasJsonStructure(cachedAnswers.value)) {
      return JSON.parse(this.screenService.cachedAnswers[this.screenService.component.id]?.value);
    }
    return [];
  }

  private triggerComponentErrorsUpdate(): void {
    this.screenService.componentErrors = {
      [this.screenService.component.id]: `${new Date().getTime()}`,
    };
  }

  private prepareUniquenessErrors(uniquenessErrors: ScenarioErrorsDto[][]): ScenarioErrorsDto[] {
    return uniquenessErrors.map((componentErrors) => {
      if (componentErrors.length) {
        return componentErrors.reduce((acc, error): ScenarioErrorsDto => {
          return { ...acc, ...error };
        }, {});
      }
    });
  }
}
