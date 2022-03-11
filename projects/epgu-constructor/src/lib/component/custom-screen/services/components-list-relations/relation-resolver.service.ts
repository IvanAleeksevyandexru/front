import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { DisplayOffRelation } from './relation-strategies/display-off-relation';
import { DisplayOnRelation } from './relation-strategies/display-on-relation';
import { BaseRelation } from './relation-strategies/base-relation';
import { GetValueRelation } from './relation-strategies/get-value-relation';
import { AutofillFromDictionaryRelation } from './relation-strategies/autofill-from-dictionary-relation';
import { CalcRelation } from './relation-strategies/calc-relation';
import { DisabledRelation } from './relation-strategies/disabled-relation';
import { FilterOnRelation } from './relation-strategies/filter-on-relation';
import { ResetControlRelation } from './relation-strategies/reset-control-relation';
import { ValidateDependentRelation } from './relation-strategies/validate-dependent-relation';
import { AutofillTextFromRefsRelation } from './relation-strategies/autofill-text-from-refs-relation';
import { FormatOnRelation } from './relation-strategies/format-on-relation';
import { UpdateRestLookupRelation } from './relation-strategies/update-rest-lookup-relation';
import { Injectable, Injector } from '@angular/core';
import { DisableButtonRelation } from './relation-strategies/disable-button-relation.service';

export const RELATION_STRATEGIES: Partial<Record<
  CustomComponentRefRelation,
  (injector: Injector) => BaseRelation
>> = {
  [CustomComponentRefRelation.autofillFromDictionary]: (injector: Injector) =>
    new AutofillFromDictionaryRelation(injector),
  [CustomComponentRefRelation.autoFillTextFromRefs]: (injector: Injector) =>
    new AutofillTextFromRefsRelation(injector),
  [CustomComponentRefRelation.calc]: (injector: Injector) => new CalcRelation(injector),
  [CustomComponentRefRelation.disabled]: (injector: Injector) => new DisabledRelation(injector),
  [CustomComponentRefRelation.disableButton]: (injector: Injector) =>
    new DisableButtonRelation(injector),
  [CustomComponentRefRelation.displayOff]: (injector: Injector) => new DisplayOffRelation(injector),
  [CustomComponentRefRelation.displayOn]: (injector: Injector) => new DisplayOnRelation(injector),
  [CustomComponentRefRelation.filterOn]: (injector: Injector) => new FilterOnRelation(injector),
  [CustomComponentRefRelation.formatOn]: (injector: Injector) => new FormatOnRelation(injector),
  [CustomComponentRefRelation.getValue]: (injector: Injector) => new GetValueRelation(injector),
  [CustomComponentRefRelation.reset]: (injector: Injector) => new ResetControlRelation(injector),
  [CustomComponentRefRelation.updateRestLookupOn]: (injector: Injector) =>
    new UpdateRestLookupRelation(injector),
  [CustomComponentRefRelation.validateDependentControl]: (injector: Injector) =>
    new ValidateDependentRelation(injector),
};

@Injectable()
export class RelationResolverService {
  private _strategies: Partial<Record<CustomComponentRefRelation, BaseRelation>> = {};

  public constructor(private injector: Injector) {}

  public isMassStrategy(relationType: CustomComponentRefRelation): boolean {
    return [
      CustomComponentRefRelation.displayOff,
      CustomComponentRefRelation.displayOn,
      // todo add CustomComponentRefRelation.disabled
    ].includes(relationType);
  }

  public getStrategy(relationType: CustomComponentRefRelation): BaseRelation {
    if (!this._strategies[relationType]) {
      this._strategies[relationType] = RELATION_STRATEGIES[relationType](this.injector);
    }

    return this._strategies[relationType];
  }
}
