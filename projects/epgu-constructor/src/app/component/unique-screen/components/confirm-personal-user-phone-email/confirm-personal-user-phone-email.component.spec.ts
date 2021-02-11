import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormatPhonePipe } from 'epgu-lib';
import { of } from 'rxjs';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import {
  ActionType,
  ComponentActionDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';


describe('ConfirmPersonalUserPhoneEmailComponent', () => {
  let component: ConfirmPersonalUserPhoneEmailComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneEmailComponent>;
  let screenService: ScreenService;
  const mockData: ComponentBase = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: ''
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: null,
    type: ActionType.nextStepModal,
  };


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [
        ConfirmPersonalUserPhoneEmailComponent,
        FormatPhonePipe,
        ActionDirective,
      ],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneEmailComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.data$ = of(mockData);
    fixture.detectChanges();
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
