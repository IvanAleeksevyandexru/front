import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmChildAddressComponent } from './confirm-child-address.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ConfirmChildAddressComponent', () => {
  let component: ConfirmChildAddressComponent;
  let fixture: ComponentFixture<ConfirmChildAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmChildAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmChildAddressComponent);
    component = fixture.componentInstance;
    component.userAddress = '';
    component.actions = '';
    component.childrenData = [{registrationAddress: 'sd', registrationAddressDate: 'fs'}];
    component.data = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
