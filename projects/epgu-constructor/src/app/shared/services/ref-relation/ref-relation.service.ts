import { Injectable } from '@angular/core';
import { CustomComponentRefRelation } from '../../components/components-list/components-list.types';

@Injectable()
export class RefRelationService {
  public isDisplayOffRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.displayOff;
  }

  public isDisplayOnRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.displayOn;
  }

  public isGetValueRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.getValue;
  }

  public isAutofillFromDictionaryRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.autofillFromDictionary;
  }

  public isCalcRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.calc;
  }

  public isDisabledRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.disabled;
  }

  public isFilterOnRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.filterOn;
  }
}
