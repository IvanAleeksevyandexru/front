import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SCREEN_COMPONENT_NAME } from '../../../../../../../../../constant/global';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../../../../../../../../services/config/constructor-config.service.stub';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';



describe('ConfirmPersonalUserAddressComponent', () => {
  let component: ConfirmPersonalUserAddressComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressComponent>;
  const mockData: ConfirmAddressInterface = {
    attrs: {
      actions: [],
      fields: []
    },
    id: '',
    value: '{}',
    label: '',
    type: SCREEN_COMPONENT_NAME.confirmPersonalUserRegAddr
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [FormsModule],
      declarations: [ ConfirmPersonalUserAddressComponent ],
      providers: [
        UnsubscribeService,
        ComponentStateService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.isEditable = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
