import { CustomListStatusElements } from '../../../components-list.types';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { BaseRelation } from './base-relation';
import { createComponentMock } from '../components-list-relations.mock';

describe('BaseRelation', () => {
  let relation: BaseRelation;
  const refRelationService: RefRelationService = MockService(RefRelationService) as unknown as RefRelationService;

  beforeEach(() => {
    relation = new class extends BaseRelation {
      handleRelation(shownElements: CustomListStatusElements) {
        return shownElements;
      }
    } (refRelationService);
  });

  describe('getRelation()', () => {
    it('should return reference relation found by component relation', () => {
      const component = createComponentMock();
      const reference = {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      };
      expect(relation['getRelation'](component, reference)).toEqual(reference);
    });
  });

});
