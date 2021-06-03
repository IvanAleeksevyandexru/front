import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from '@epgu/epgu-lib';
import { By } from '@angular/platform-browser';

import { SelectChildrenItemComponent } from './select-children-item.component';
import { ConstructorDropdownModule } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListModule } from '../../../../../custom-screen/components-list.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { ModalService } from '../../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DictionaryToolsService } from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { RefRelationService } from '../../../../../../shared/services/ref-relation/ref-relation.service';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { configureTestSuite } from 'ng-bullet';

describe('SelectChildrenItemComponent', () => {
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
        RouterTestingModule,
        ConstructorDropdownModule,
        ComponentsListModule,
        BaseComponentsModule,
      ],
      providers: [
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DatesToolsService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
        DictionaryToolsService,
        RefRelationService,
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

  it('should call selectChildren()', () => {
    jest.spyOn(component, 'selectChildren');
    jest.spyOn(component.selectChildrenEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-cf-ui-constructor-constructor-dropdown'));
    debugEl.triggerEventHandler('changed', {});
    fixture.detectChanges();

    expect(component.selectChildren).toHaveBeenCalled();
    expect(component.selectChildrenEvent.emit).toHaveBeenCalled();
  });

  it('should call updateChild()', () => {
    jest.spyOn(component, 'updateChild');
    jest.spyOn(component.updateChildEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-container'));
    debugEl.triggerEventHandler('changes', {});
    fixture.detectChanges();

    expect(component.updateChild).toHaveBeenCalled();
    expect(component.updateChildEvent.emit).toHaveBeenCalled();
  });

  it('should call updateItemValueAndValidity()', () => {
    jest.spyOn(component, 'updateItemValueAndValidity');
    jest.spyOn(component.updateItemValueAndValidityEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-container'));
    debugEl.triggerEventHandler('emitFormStatus', {});
    fixture.detectChanges();

    expect(component.updateItemValueAndValidity).toHaveBeenCalled();
    expect(component.updateItemValueAndValidityEvent.emit).toHaveBeenCalled();
  });
});
