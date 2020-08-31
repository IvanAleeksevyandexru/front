import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { ConfirmPersonalUserPhoneComponent } from './confirm-personal-user-phone.component';

describe('ConfirmPersonalUserPhoneComponent', () => {
  let component: ConfirmPersonalUserPhoneComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneComponent>;
  const mockData = '';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserPhoneComponent ],
      providers: [ ComponentStateService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
