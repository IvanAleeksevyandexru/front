import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { ConfirmPersonalUserPhoneScreenComponent } from './confirm-personal-user-phone-screen.component';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service'
import { EgpuResponseComponentInterface } from '../../../../../../../interfaces/epgu.service.interface'


describe('ConfirmPersonalUserPhoneScreenComponent', () => {
  let component: ConfirmPersonalUserPhoneScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneScreenComponent>;
  let mockData: EgpuResponseComponentInterface = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserPhoneScreenComponent ],
      providers: [ ScreenComponentService ]
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
