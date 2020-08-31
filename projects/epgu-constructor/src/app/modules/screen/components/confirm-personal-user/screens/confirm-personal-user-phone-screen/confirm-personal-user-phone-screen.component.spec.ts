import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPersonalUserPhoneScreenComponent } from './confirm-personal-user-phone-screen.component';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface'
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';



describe('ConfirmPersonalUserPhoneScreenComponent', () => {
  let component: ConfirmPersonalUserPhoneScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneScreenComponent>;
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
      declarations: [ ConfirmPersonalUserPhoneScreenComponent ],
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
