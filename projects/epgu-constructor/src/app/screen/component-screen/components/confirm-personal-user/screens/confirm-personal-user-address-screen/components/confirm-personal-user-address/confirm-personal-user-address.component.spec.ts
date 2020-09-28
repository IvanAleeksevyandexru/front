import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ConfigServiceStub } from '../../../../../../../../config/config.service.stub';
import { ComponentStateService } from '../../../../../../../component-state.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ComponentScreenComponentTypes } from '../../../../../../component-screen.types';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';



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
    type: ComponentScreenComponentTypes.confirmPersonalUserRegAddr
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [FormsModule],
      declarations: [ ConfirmPersonalUserAddressComponent ],
      providers: [
        UnsubscribeService,
        ComponentStateService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub }
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
