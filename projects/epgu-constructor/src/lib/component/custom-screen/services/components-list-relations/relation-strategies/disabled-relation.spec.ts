import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { DisabledRelation } from './disabled-relation';
import { setupForRelationStrategy } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';
import { BaseRelation } from './base-relation';

describe('DisabledRelation', () => {
  let relation: DisabledRelation;
  let componentVal = { foo: 'bar' };
  let refRelationService: RefRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DisabledRelation,
        BaseRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(DisabledRelation);
    refRelationService = TestBed.inject(RefRelationService);
  });

  it('should do nothing if isValueEquals() === TRUE AND component is disabled', () => {
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    let { reference, dependentComponent, dependentControl, form } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.disabled },
      dependentComponentExtra: { id: 'dependentComponentId' },
      dependentControlValue: 'a',
    });

    dependentControl.disable();
    dependentControl.markAsTouched();

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    expect(dependentControl.get('value').value).toBe('a');
    expect(dependentControl.touched).toBeTruthy();
    expect(dependentControl.enabled).toBeFalsy();
  });

  it('should patchValueAndDisable if isValueEquals() === TRUE and control is enabled', () => {
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    let { reference, dependentComponent, dependentControl, form } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.disabled },
      dependentComponentExtra: { id: 'dependentComponentId' },
      dependentControlValue: 'a',
    });

    dependentControl.markAsTouched();

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    // если в reference нет defaultValue, то контролу устанавливается ""
    expect(dependentControl.get('value').value).toBe('');
    expect(dependentControl.touched).toBeFalsy();
    expect(dependentControl.enabled).toBeFalsy();
  });

  it('should patchValueAndDisable if isValueEquals() === TRUE and control is enabled and has default value', () => {
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    let { reference, dependentComponent, dependentControl, form } = setupForRelationStrategy({
      referenceExtra: {
        relation: CustomComponentRefRelation.disabled,
        defaultValue: 'some default value',
      },
      dependentComponentExtra: { id: 'dependentComponentId' },
      dependentControlValue: 'a',
    });

    dependentControl.markAsTouched();

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    // контролу устанавливается значение reference.defaultValue
    expect(dependentControl.get('value').value).toBe('some default value');
    expect(dependentControl.touched).toBeFalsy();
    expect(dependentControl.enabled).toBeFalsy();
  });

  it('should patchValueAndEnable if isValueEquals() === FALSE AND component does not have any disabled refs with same value', () => {
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);

    let { reference, dependentComponent, dependentControl, form } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.disabled },
      dependentComponentExtra: { id: 'dependentComponentId' },
      dependentControlValue: 'a',
    });

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    expect(dependentControl.enabled).toBeTruthy();

    // значение контрола не изменилось, т.к. в кэше сервиса (this.prevValues) нет значения для компонента
    expect(dependentControl.get('value').value).toBe('a');

    // делаем это для того, чтобы в кэше сервиса (this.prevValues) сохранилось значение для компонента
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    relation.handleRelation(dependentComponent, reference, componentVal, form);

    dependentControl = new FormGroup({
      id: new FormControl(dependentComponent.id),
      value: new FormControl('b'),
    });
    dependentControl.disable();
    form = new FormArray([dependentControl]);

    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
    relation.handleRelation(dependentComponent, reference, componentVal, form);

    // значение контрола изменилось, т.к. в кэше сервиса (this.prevValues) есть значение для компонента
    expect(dependentControl.get('value').value).toBe('a');
    expect(dependentControl.enabled).toBeTruthy();
  });

  it('should do nothing if isValueEquals() === FALSE AND component has any disabled refs with same value', () => {
    // делаем это для того, чтобы в кэше сервиса (this.prevValues) сохранилось значение для компонента
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    let { reference, dependentComponent, form } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.disabled },
      dependentComponentExtra: {
        id: 'dependentComponentId',
        attrs: {
          ref: [
            {
              relatedRel: 'dependentComponentId',
              val: 'any value',
              relation: CustomComponentRefRelation.filterOn,
            },
            {
              relatedRel: 'dependentComponentId',
              val: 'b',
              relation: CustomComponentRefRelation.disabled,
            },
          ],
        },
      },
      dependentControlValue: 'b',
    });

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    let dependentControl = new FormGroup({
      id: new FormControl(dependentComponent.id),
      value: new FormControl('b'),
    });
    dependentControl.disable();
    form = new FormArray([dependentControl]);

    // эта функция будет вызываться 2 раза, первый раз должна вернуть FALSE, второй раз она используется в приватной функции
    // componentHasAnyDisabledRefsWithSameValue() и должна вернуть TRUE, поэтому вместо mockReturnValue сделал mockImplementation
    jest
      .spyOn(refRelationService, 'isValueEquals')
      .mockImplementation((a: unknown, b: unknown) => a === b);

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    expect(dependentControl.get('value').value).toBe('b');
    expect(dependentControl.enabled).toBeFalsy();
  });
});
