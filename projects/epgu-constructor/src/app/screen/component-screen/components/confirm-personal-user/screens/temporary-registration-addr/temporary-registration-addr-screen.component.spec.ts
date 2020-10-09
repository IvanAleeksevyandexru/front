import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TemporaryRegistrationComponent } from './temporary-registration-addr-screen.types';
import { TemporaryRegistrationAddrScreenComponent } from './temporary-registration-addr-screen.component';
import { CurrentAnswersService } from '../../../../../current-answers.service';

describe('TemporaryRegistrationAddrScreenComponent', () => {
  let component: TemporaryRegistrationAddrScreenComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrScreenComponent>;
  const mockData: TemporaryRegistrationComponent = {
    attrs: {
      actions: [],
      fields: [],
      hints: []
    },
    id: '',
    label: '',
    type: '',
    value: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [TemporaryRegistrationAddrScreenComponent],
      providers: [CurrentAnswersService]
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
