import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ToolsService } from '../../../../../shared/services/tools/tools.service';
import { ComponentScreenComponentTypes } from '../../../../component-screen-components.types';
import { ConfirmPersonalUserAddressScreenComponent } from './confirm-personal-user-address-screen.component';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';


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
    type: ComponentScreenComponentTypes.confirmPersonalUserRegAddr,
    value: '',
    required: false
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmPersonalUserAddressScreenComponent ],
      providers: [ CurrentAnswersService, ToolsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.applicantAnswers = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});