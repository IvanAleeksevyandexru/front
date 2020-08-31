import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ConfirmPersonalUserPhoneScreenComponent } from './confirm-personal-user-phone-screen.component';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserScreenLayoutComponent } from '../../sub-components/confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import { ConfirmPersonalUserPhoneComponent } from './components/confirm-personal-user-phone/confirm-personal-user-phone.component';


describe('ConfirmPersonalUserPhoneScreenComponent', () => {
  let component: ConfirmPersonalUserPhoneScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneScreenComponent>;
  let ConfirmPersonalUserPhoneComponentMock = MockComponent(ConfirmPersonalUserPhoneComponent);
  const mockData: ComponentInterface = {
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
        ConfirmPersonalUserPhoneComponentMock,
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

  it('check snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
