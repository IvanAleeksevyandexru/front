import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { By } from '@angular/platform-browser';

import { SelectChildrenItemComponent } from './select-children-item.component';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ComponentsListModule } from '../../../../../shared/components/components-list/components-list.module';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectChildrenItemComponent],
      imports: [RouterTestingModule, ConstructorDropdownModule, ComponentsListModule],
      providers: [
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DatesToolsService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectChildren()', () => {
    jest.spyOn(component, 'selectChildren');
    jest.spyOn(component.selectChildrenEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-constructor-dropdown'));
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

  it('should call updateItemValidationStatus()', () => {
    jest.spyOn(component, 'updateItemValidationStatus');
    jest.spyOn(component.updateItemValidationStatusEvent, 'emit');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-list'));
    debugEl.triggerEventHandler('emitFormStatus', {});
    fixture.detectChanges();

    expect(component.updateItemValidationStatus).toHaveBeenCalled();
    expect(component.updateItemValidationStatusEvent.emit).toHaveBeenCalled();
  });
});
