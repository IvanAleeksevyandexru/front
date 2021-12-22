import { CustomComponent } from '../../../components-list.types';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { GetValueRelation } from './get-value-relation';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';

describe('GetValueRelation', () => {
  let relation: GetValueRelation;
  let componentVal: KeyValueMap = ('some value' as unknown) as KeyValueMap;
  let components: CustomComponent[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GetValueRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(GetValueRelation);
  });

  it('should patch dependentControl value', () => {
    let { reference, dependentComponent, form, dependentControl } = setupForRelationStrategy({
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
      // @ts-ignore
      dependentControlValue: {
        firstControl: 'first value',
        secondControl: 'second value',
      },
    });
    components = [createComponentMock({ id: 'someSourceId' })];

    relation.handleRelation(dependentComponent, reference, componentVal, form, components);

    expect(dependentControl.get('value').value).toEqual({
      firstControl: 'first value',
      secondControl: 'second value',
    });
  });
});
