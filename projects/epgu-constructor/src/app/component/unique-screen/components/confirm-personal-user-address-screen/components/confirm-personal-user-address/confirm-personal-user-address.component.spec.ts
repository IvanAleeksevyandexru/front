import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { of } from 'rxjs';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { UniqueScreenComponentTypes } from '../../../../unique-screen-components.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';

describe('ConfirmPersonalUserAddressComponent', () => {
  let component: ConfirmPersonalUserAddressComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressComponent>;
  const mockData: ConfirmAddressInterface = {
    attrs: {
      actions: [],
      fields: [],
    },
    id: '',
    value: '{}',
    label: '',
    type: UniqueScreenComponentTypes.confirmPersonalUserRegAddr,
    required: false,
    valueFromCache: false,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ConfirmPersonalUserAddressComponent],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        DatesToolsService,
        SuggestHandlerService,
        EventBusService,
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
