import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectChildrenItemComponent } from './select-children-item.component';
import {
  ConstructorDropdownModule,
  HttpCancelService,
  LoggerService,
  LoggerServiceStub,
  HealthService,
  MemoModule,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListModule } from '../../../../../custom-screen/components-list.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DictionaryToolsService } from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { RefRelationService } from '../../../../../../shared/services/ref-relation/ref-relation.service';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { configureTestSuite } from 'ng-bullet';
import { MockModule } from 'ng-mocks';
import { TypeCastService } from '../../../../../../core/services/type-cast/type-cast.service';
import { DateRefService } from '../../../../../../core/services/date-ref/date-ref.service';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';

// TODO: разобраться почему падает с ошибкой 'Cannot read property 'pipe' of undefined'
xdescribe('SelectChildrenItemComponent', () => {
  let component: SelectChildrenItemComponent;
  let fixture: ComponentFixture<SelectChildrenItemComponent>;
  let componentMock: any = [
    {
      id: 'ai19_0',
      type: 'StringInput',
      label: 'Идентификатор',
      attrs: {
        hidden: true,
        fields: [{ fieldName: 'id' }],
        validation: [
          {
            type: 'RegExp',
            value: '.+',
            ref: '',
            dataType: '',
            condition: '',
            errorMsg: 'Поле не может быть пустым',
          },
        ],
      },
      value: '',
      required: true,
    },
    {
      id: 'ai19_6',
      type: 'RadioInput',
      label: 'Ребенок новый?',
      attrs: {
        hidden: true,
        fields: [{ fieldName: 'isNew' }],
        supportedValues: [
          { label: 'Да', value: true },
          { label: 'Нет', value: false, isDefault: false },
        ],
        isHorizontal: true,
      },
      value: '',
      required: true,
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SelectChildrenItemComponent],
      imports: [
        MockModule(BaseUiModule),
        ConstructorDropdownModule,
        ComponentsListModule,
        BaseComponentsModule,
        MemoModule,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        HealthService,
        DatesToolsService,
        UnsubscribeService,
        DateRefService,
        JsonHelperService,
        CurrentAnswersService,
        HttpCancelService,
        DictionaryToolsService,
        RefRelationService,
        TypeCastService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenItemComponent);
    component = fixture.componentInstance;
    component.idx = 2;
    component.children = [];
    component.errors = {};
    component.isNewChild = true;
    component.components = componentMock;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should be showComponents', () => {
    component.visibleComponents = ['ai19_0'];
    component.writableComponents = ['ai19_0'];
    component.control = new FormControl({ ai19_0: '' });
    fixture.detectChanges();

    const result = component.showComponents(componentMock);
    expect(result[0].attrs.disabled).toBeFalsy();
    expect(result.length).toBe(1);
  });

  it('should call selectChildren()', () => {
    jest.spyOn(component, 'selectChildren');
    jest.spyOn(component.selectChildrenEvent, 'emit');
    const debugEl = fixture.debugElement.query(
      By.css('epgu-cf-ui-constructor-constructor-dropdown'),
    );
    debugEl.triggerEventHandler('changed', {});
    fixture.detectChanges();

    expect(component.selectChildren).toHaveBeenCalled();
    expect(component.selectChildrenEvent.emit).toHaveBeenCalled();
  });

  it('should call updateChild()', () => {
    jest.spyOn(component, 'updateChild');
    jest.spyOn(component.updateChildEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-list'));
    debugEl.triggerEventHandler('changes', {});
    fixture.detectChanges();

    expect(component.updateChild).toHaveBeenCalled();
    expect(component.updateChildEvent.emit).toHaveBeenCalled();
  });

  it('should call updateItemValueAndValidity()', () => {
    jest.spyOn(component, 'updateItemValueAndValidity');
    jest.spyOn(component.updateItemValueAndValidityEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-list'));
    debugEl.triggerEventHandler('emitFormStatus', {});
    fixture.detectChanges();

    expect(component.updateItemValueAndValidity).toHaveBeenCalled();
    expect(component.updateItemValueAndValidityEvent.emit).toHaveBeenCalled();
  });
});
