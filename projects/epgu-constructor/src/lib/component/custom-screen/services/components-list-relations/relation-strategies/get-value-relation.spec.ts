import { CustomComponent } from '../../../components-list.types';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { GetValueRelation } from './get-value-relation';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';

describe('GetValueRelation', () => {
  let relation: GetValueRelation;
  let componentVal = 'some value';
  let components: CustomComponent[] = [];
  const refRelationService: RefRelationService = (MockService(
    RefRelationService,
  ) as unknown) as RefRelationService;

  beforeEach(() => {
    relation = new GetValueRelation(refRelationService);
  });

  it('should patch dependentControl value', () => {
    let {
      reference,
      dependentComponent,
      form,
      shownElements,
      dependentControl,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.getValue },
      dependentComponentExtra: {
        attrs: {
          ref: [
            {
              relatedRel: 'rf2',
              val: 'some value',
              relation: CustomComponentRefRelation.getValue,
              sourceId: 'someSourceId',
            },
          ],
        },
      },
      dependentControlValue: {
        firstControl: 'first value',
        secondControl: 'second value',
      },
    });
    components = [createComponentMock({ id: 'someSourceId' })];

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
    );

    expect(dependentControl.get('value').value).toEqual({
      firstControl: 'first value',
      secondControl: 'second value',
    });
  });
});
