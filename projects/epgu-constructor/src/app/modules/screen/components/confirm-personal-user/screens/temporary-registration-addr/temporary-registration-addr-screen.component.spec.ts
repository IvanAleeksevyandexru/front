import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../interfaces/temporary-registration-addr.interface';
import { TemporaryRegistrationAddrScreenComponent } from './temporary-registration-addr-screen.component';


describe('TemporaryRegistrationAddrScreenComponent', () => {
  let component: TemporaryRegistrationAddrScreenComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrScreenComponent>;
  const mockData: TemporaryRegistrationAddrComponentInterface = {
    attrs: {
      actions: [],
      fields: [],
      hints: []
    },
    id: '',
    label: '',
    type: '',
    value: ''
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ TemporaryRegistrationAddrScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryRegistrationAddrScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
