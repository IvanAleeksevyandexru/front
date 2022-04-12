import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockModule, MockProvider } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseUiModule, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { SelectFromListComponent } from './select-from-list.component';
import { SelectFromListService } from './select-from-list.service';
import { SelectFromListServiceStub } from './select-from-list.service.stub';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { TypeCastService } from '../../../../core/services/type-cast/type-cast.service';
import ChildrenClubsListService from '../../../unique-screen/components/children-clubs/services/children-clubs-list.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { StateService } from '../../../unique-screen/components/children-clubs/services/state/state.service';

import SelectFromListModelAttrs from './SelectFromListModelAttrs';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import LookupInputModel from '../lookup-input/LookupInputModel';
import SelectFromListModel from './SelectFromListModel';
import { InviteService } from '../../../../core/services/invite/invite.service';
import { InviteServiceStub } from '../../../../core/services/invite/invite.service.stub';
import { ForTestsOnlyModule } from '../../../../core/for-tests-only.module';

const mockSelectListComponent = {
  id: 'rb12',
  type: 'RadioInput',
  attrs: new SelectFromListModelAttrs({
    dictionaryType: 'lookUpInputType',
    searchProvider: {
      dictionaryOptions: { additionalParams: [] },
      dictionaryFilter: [
        {
          attributeName: 'Session_Id',
          condition: 'EQUALS' as any,
          value: 'value',
          valueType: 'rawFilter',
        },
      ],
    },
  }),
  label: 'Осуждены ли вы за совершение преступления?',
  value: null,
  visited: false,
  required: false,
};

describe('SelectFromListComponent', () => {
  let component: SelectFromListComponent;
  let fixture: ComponentFixture<SelectFromListComponent>;
  let formService: ComponentsListFormServiceStub;
  let listService: SelectFromListService;
  let control: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectFromListComponent, MockComponents(ComponentItemComponent)],
      imports: [MockModule(BaseUiModule), ForTestsOnlyModule],
      providers: [
        SelectFromListServiceStub,
        InterpolationService,
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        MockProvider(StateService),
        ComponentsListToolsService,
        TypeCastService,
        { provide: InviteService, useClass: InviteServiceStub },
        { provide: SelectFromListService, useClass: SelectFromListServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ChildrenClubsListService, useClass: SelectFromListServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(SelectFromListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    listService = TestBed.inject(SelectFromListService);
    control = new FormGroup({
      attrs: new FormControl(mockSelectListComponent.attrs),
      id: new FormControl('id'),
      value: new FormControl(mockSelectListComponent, [Validators.requiredTrue]),
      model: new FormControl(
        new SelectFromListModel({ attrs: mockSelectListComponent.attrs } as any),
      ),
    });
    formService._form = new FormArray([control]);
    fixture = TestBed.createComponent(SelectFromListComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('subscribeOnValueChange', () => {
    it('should check radio with choosen element and uncheck others', () => {
      const testElement = { checked: false, id: 1 };
      const testElement1 = { checked: true, id: 2 };
      component.fullList = [testElement, testElement1] as any;

      component.subscribeOnValueChange();
      control.get('value').patchValue(testElement);

      expect(component.fullList[0].checked).toBeTruthy();
      expect(component.fullList[1].checked).toBeFalsy();
    });
  });

  describe('leftElementCount$', () => {
    it('should count left elements on subscribe', () => {
      component.fullList = [{}, {}, {}] as any;
      component.attrs.listIncrementLength = 6;

      (listService.paginatedData$ as any).next([{}]);

      component.leftElementCount$.subscribe((val) => {
        expect(val).toBe(2);
      });
    });

    it('should count left elements on subscribe', () => {
      component.fullList = [{}, {}, {}] as any;
      component.attrs.listIncrementLength = 1;

      (listService.paginatedData$ as any).next([{}]);

      component.leftElementCount$.subscribe((val) => {
        expect(val).toBe(1);
      });
    });
  });

  describe('processList', () => {
    it('should interpolate fields depending on values from dictionary', () => {
      const fullList = [
        { originalItem: { attributeValues: { test: 'test', text: 'text' } } },
      ] as any;
      component.attrs.label = '${test} 123';
      component.attrs.description = { text: '${text} 321' };

      component.processList(fullList);

      expect(fullList[0].label).toBe('test 123');
      expect(fullList[0].description).toBe('text 321');
    });
  });
});
