import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../../../../core/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../../../shared/services/unsubscribe/unsubscribe.service';
import { ComponentScreenComponentTypes } from '../../../../../../component-screen-components.types';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';



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
    type: ComponentScreenComponentTypes.confirmPersonalUserRegAddr,
    required: false
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [FormsModule],
      declarations: [ ConfirmPersonalUserAddressComponent ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
