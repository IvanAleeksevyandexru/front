import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomComponentRef } from '../../../components-list.types';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { AutofillTextFromRefsRelation } from './autofill-text-from-refs-relation';
import { createComponentMock } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';
import { InterpolationService } from '../../../../../shared/services/interpolation/interpolation.service';

describe('AutofillTextFromRefsRelation', () => {
  let relation: AutofillTextFromRefsRelation;
  let reference: CustomComponentRef;
  let dependentComponent;
  let dependentControl;
  let form;
  let componentVal: KeyValueMap = { title: 'some title', address: 'some address' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutofillTextFromRefsRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
        InterpolationService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(AutofillTextFromRefsRelation);
    reference = {
      relatedRel: 'rf2',
      relation: CustomComponentRefRelation.autoFillTextFromRefs,
      relatedRelValues: {
        reference_to_name: 'title',
        reference_to_address: 'address',
      },
      val: '',
    };

    dependentComponent = createComponentMock({
      id: 'rf2',
      label: 'label with ${reference_to_name}',
      clarification: 'clarification with ${reference_to_address}',
      hint: 'not match for replace ${not_match}',
    });

    dependentControl = new FormGroup({
      id: new FormControl(dependentComponent.id),
      label: new FormControl(dependentComponent.label),
      clarification: new FormControl((dependentComponent as any).clarification),
      hint: new FormControl(dependentComponent.hint),
    });
    form = new FormArray([dependentControl]);
  });

  it('should patch dependentControl value', () => {
    relation.handleRelation(dependentComponent, reference, componentVal, form);

    expect(dependentControl.value).toEqual({
      id: 'rf2',
      label: 'label with some title',
      clarification: 'clarification with some address',
      hint: 'not match for replace',
    });
  });
});
