import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';
import { ConfirmUserDataInterface } from '../../../../../../../interfaces/confirm-user-data.interface'


describe('ConfirmPersonalUserDataScreenComponent', () => {
  let component: ConfirmPersonalUserDataScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataScreenComponent>;
  const mockData: ConfirmUserDataInterface = {
    attrs: {
      fields: [],
      actions: []
    },
    id: '',
    label: '',
    type: '',
    value: '',
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserDataScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
