import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { BaseRelation } from './base-relation';
import { createComponentMock } from '../components-list-relations.mock';
import { TestBed } from '@angular/core/testing';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { Injectable } from '@angular/core';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { FormArray } from '@angular/forms';

@Injectable()
class ConcreteDisplayRelation extends BaseRelation {
  public handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    _reference: CustomComponentRef,
    _componentVal: KeyValueMap | '',
    form: FormArray,
  ): void {
    super.afterHandleRelation(dependentComponent, form);
  }

  public getRelation(
    component: CustomComponent,
    reference: CustomComponentRef,
  ): CustomComponentRef {
    return super.getRelation(component, reference);
  }
}

describe('BaseRelation', () => {
  let relation: ConcreteDisplayRelation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConcreteDisplayRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(ConcreteDisplayRelation);
  });

  describe('getRelation()', () => {
    it('should return reference relation found by component relation', () => {
      const component = createComponentMock();
      const reference = {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      };
      expect(relation.getRelation(component, reference)).toEqual(reference);
    });
  });
});
