import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_COMPONENT_NAME } from '../../../../../../../constant/global';
import { ConfirmAddressInterface } from '../../../../../../../interfaces/confirm-address.interface';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';
import { ConstructorService } from '../../../../../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../../../../../services/constructor/constructor.service.stub';
import { ConfirmPersonalUserAddressScreenComponent } from './confirm-personal-user-address-screen.component';


describe('ConfirmPersonalUserAddressScreenComponent', () => {
  let component: ConfirmPersonalUserAddressScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressScreenComponent>;
  const mockData: ConfirmAddressInterface = {
    attrs: {
      fields: [],
      actions: []
    },
    id: '',
    label: '',
    type: SCREEN_COMPONENT_NAME.confirmPersonalUserRegAddr,
    value: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserAddressScreenComponent ],
      providers: [
        ComponentStateService,
        { provide: ConstructorService, useClass: ConstructorServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
