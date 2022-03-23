import { FormArray, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import {
  BaseUiModule,
  ConfigService,
  ConfigServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentMock } from '../../services/components-list-relations/components-list-relations.mock';
import LookupInputModel from '../lookup-input/LookupInputModel';
import BaseModel from '../../component-list-resolver/BaseModel';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { CustomComponent } from '../../components-list.types';
import AbstractDictionaryLikeComponent from './abstract-dictionary-like.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';

@Component({
  template: '<div></div>',
})
class ConcreteDictionaryLikeComponent extends AbstractDictionaryLikeComponent<
  DictionarySharedAttrs
> {}

describe('AbstractDictionaryLikeComponent', () => {
  let component: ConcreteDictionaryLikeComponent;
  let fixture: ComponentFixture<ConcreteDictionaryLikeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcreteDictionaryLikeComponent],
      imports: [
        MockModule(ValidationTypeModule),
        MockModule(BaseUiModule),
        HttpClientTestingModule,
      ],
      providers: [
        MockProvider(UnsubscribeService),
        MockProvider(ComponentsListToolsService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
      ],
    })
      .overrideComponent(ConcreteDictionaryLikeComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcreteDictionaryLikeComponent);
    component = fixture.componentInstance;
  });

  it('should be instantiated', function () {
    expect(component).toBeTruthy();
  });

  describe('onAfterFilterOnRel()', () => {
    const setup = (
      references = [
        {
          relatedRel: componentMock.id,
          val: '*',
          relation: 'filterOn',
          dictionaryFilter: [],
        },
      ],
    ) => {
      const dependentComponent = new LookupInputModel(({
        id: 'acc_org',
        type: 'Lookup',
        required: true,
        disabled: false,
        label: 'Расчётный счёт',
        attrs: {
          ref: references ? [...references] : [],
        },
        value: '',
        visited: false,
      } as unknown) as BaseModel<DictionarySharedAttrs>);

      const fb = new FormBuilder();
      const mockForm = new FormArray([
        fb.group({ ...componentMock }),
        fb.group({ ...dependentComponent }),
      ]);
      const control = mockForm.controls[0];
      const dependentControl = mockForm.controls[1];

      return { control, dependentComponent, dependentControl, mockForm, references };
    };

    it('should do nothing when no ref', () => {
      const { dependentControl, mockForm } = setup(null);
      const dependentControlSpy = jest.spyOn(dependentControl, 'disable');

      component['onAfterFilterOnRel'](componentMock as BaseModel<DictionarySharedAttrs>, mockForm);

      expect(dependentControlSpy).not.toBeCalled();
    });

    it('should reset dependent control', () => {
      const { dependentControl, control, mockForm, dependentComponent } = setup();
      const disabledControl = dependentControl.get('disabled');
      const dependentControlSpy = jest.spyOn(disabledControl, 'patchValue');
      control.markAsTouched();
      dependentComponent.loadReferenceData$(
        of({
          component: dependentComponent as CustomComponent,
          data: {
            error: { code: 0, message: 'emptyDictionary' },
            fieldErrors: [],
            items: [],
            total: 0,
          },
        }),
      );
      component['onAfterFilterOnRel'](dependentComponent, mockForm);

      expect(dependentControlSpy).toBeCalledWith(true);
    });

    it('should NOT affect another relations', () => {
      const refs = [
        {
          relatedRel: componentMock.id,
          val: '',
          relation: 'displayOff',
        },
        {
          relatedRel: componentMock.id,
          val: '*',
          relation: 'filterOn',
          dictionaryFilter: [
            {
              attributeName: 'section',
              condition: 'EQUALS',
              value: 'id',
              valueType: 'preset',
            },
          ],
        },
      ];
      const refsExpected = JSON.parse(JSON.stringify(refs));
      const { dependentControl, control, mockForm, dependentComponent } = setup(refs as any);
      const disabledControl = dependentControl.get('disabled');
      const dependentControlSpy = jest.spyOn(disabledControl, 'patchValue');
      control.markAsTouched();

      dependentComponent.loadReferenceData$(
        of({
          component: dependentComponent as CustomComponent,
          data: {
            error: { code: 0, message: 'emptyDictionary' },
            fieldErrors: [],
            items: [],
            total: 0,
          },
        }),
      );

      component['onAfterFilterOnRel'](dependentComponent, mockForm);

      expect(dependentControlSpy).toBeCalledWith(true);
      expect(dependentComponent.attrs.ref).toEqual(refsExpected);
    });
  });
});
