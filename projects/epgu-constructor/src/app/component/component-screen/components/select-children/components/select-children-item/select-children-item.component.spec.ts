import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { By } from '@angular/platform-browser';

import { SelectChildrenItemComponent } from './select-children-item.component';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ComponentsListModule } from '../../../../../components-list/components-list.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ItemStatus } from '../../select-children.models';

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
      providers: [HealthService, { provide: ScreenService, useClass: ScreenServiceStub }],
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

  it('should call selectChildrenEvent', () => {
    jest.spyOn(component.selectChildrenEvent, 'emit');
    component.selectChildren({});

    expect(component.selectChildrenEvent.emit).toHaveBeenCalled();
  });

  it('should call selectChildren()', () => {
    jest.spyOn(component, 'selectChildren');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-constructor-dropdown'));
    debugEl.triggerEventHandler('changed', {});
    fixture.detectChanges();

    expect(component.selectChildren).toHaveBeenCalled();
  });

  it('should call updateChildEvent', () => {
    jest.spyOn(component.updateChildEvent, 'emit');
    component.updateChild({});

    expect(component.updateChildEvent.emit).toHaveBeenCalled();
  });

  it('should call updateChild()', () => {
    jest.spyOn(component, 'updateChild');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-list'));
    debugEl.triggerEventHandler('changes', {});
    fixture.detectChanges();

    expect(component.updateChild).toHaveBeenCalled();
  });

  it('should call updateItemValidationStatusEvent', () => {
    jest.spyOn(component.updateItemValidationStatusEvent, 'emit');
    component.updateItemValidationStatus(ItemStatus.valid);

    expect(component.updateItemValidationStatusEvent.emit).toHaveBeenCalled();
  });

  it('should call updateItemValidationStatus()', () => {
    jest.spyOn(component, 'updateItemValidationStatus');
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-components-list'));
    debugEl.triggerEventHandler('emitFormStatus', {});
    fixture.detectChanges();

    expect(component.updateItemValidationStatus).toHaveBeenCalled();
  });
});
