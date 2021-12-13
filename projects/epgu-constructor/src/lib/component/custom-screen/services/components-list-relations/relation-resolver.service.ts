import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { DisplayOffRelation } from './relation-strategies/display-off-relation';
import { DisplayOnRelation } from './relation-strategies/display-on-relation';
import { BaseRelation } from './relation-strategies/base-relation';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
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
import { Injectable } from '@angular/core';

export const RELATION_STRATEGIES: Partial<Record<
  CustomComponentRefRelation,
  (refRelationService: RefRelationService) => BaseRelation
>> = {
  [CustomComponentRefRelation.autofillFromDictionary]: (refRelationService: RefRelationService) =>
    new AutofillFromDictionaryRelation(refRelationService),
  [CustomComponentRefRelation.autoFillTextFromRefs]: (refRelationService: RefRelationService) =>
    new AutofillTextFromRefsRelation(refRelationService),
  [CustomComponentRefRelation.calc]: (refRelationService: RefRelationService) =>
    new CalcRelation(refRelationService),
  [CustomComponentRefRelation.disabled]: (refRelationService: RefRelationService) =>
    new DisabledRelation(refRelationService),
  [CustomComponentRefRelation.displayOff]: (refRelationService: RefRelationService) =>
    new DisplayOffRelation(refRelationService),
  [CustomComponentRefRelation.displayOn]: (refRelationService: RefRelationService) =>
    new DisplayOnRelation(refRelationService),
  [CustomComponentRefRelation.filterOn]: (refRelationService: RefRelationService) =>
    new FilterOnRelation(refRelationService),
  [CustomComponentRefRelation.formatOn]: (refRelationService: RefRelationService) =>
    new FormatOnRelation(refRelationService),
  [CustomComponentRefRelation.getValue]: (refRelationService: RefRelationService) =>
    new GetValueRelation(refRelationService),
  [CustomComponentRefRelation.reset]: (refRelationService: RefRelationService) =>
    new ResetControlRelation(refRelationService),
  [CustomComponentRefRelation.updateRestLookupOn]: (refRelationService: RefRelationService) =>
    new UpdateRestLookupRelation(refRelationService),
  [CustomComponentRefRelation.validateDependentControl]: (refRelationService: RefRelationService) =>
    new ValidateDependentRelation(refRelationService),
};

@Injectable()
export class RelationResolverService {
  private _strategies: Partial<Record<CustomComponentRefRelation, BaseRelation>> = {};

  constructor(private refRelationService: RefRelationService) {}

  public getStrategy(relationType: CustomComponentRefRelation): BaseRelation {
    if (!this._strategies[relationType]) {
      this._strategies[relationType] = RELATION_STRATEGIES[relationType](this.refRelationService);
    }

    return this._strategies[relationType];
  }
}
