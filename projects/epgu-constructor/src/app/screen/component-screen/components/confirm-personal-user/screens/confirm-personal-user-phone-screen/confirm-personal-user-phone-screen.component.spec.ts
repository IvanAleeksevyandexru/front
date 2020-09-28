import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ConfirmPersonalUserPhoneScreenComponent } from './confirm-personal-user-phone-screen.component';
import { ComponentStateService } from '../../../../../component-state.service';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserScreenLayoutComponent } from '../../sub-components/confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import { ConfirmPersonalUserPhoneComponent } from './components/confirm-personal-user-phone/confirm-personal-user-phone.component';
import { ComponentBase } from '../../../../../screen.types';


describe('ConfirmPersonalUserPhoneScreenComponent', () => {
  let component: ConfirmPersonalUserPhoneScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneScreenComponent>;
  const mockData: ComponentBase = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [
        ConfirmPersonalUserPhoneScreenComponent,
        ConfirmPersonalUserScreenLayoutComponent
      ],
      providers: [ ComponentStateService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
