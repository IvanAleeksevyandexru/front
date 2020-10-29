import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormatPhonePipe } from 'epgu-lib';
import { ConfigService } from '../../../../../../shared/config/config.service';
import { ConfigServiceStub } from '../../../../../../shared/config/config.service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../../../screen/screen.types';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserScreenLayoutComponent } from '../../sub-components/confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { ActionType } from '../../../../../../form-player/services/form-player-api/form-player-api.types';


xdescribe('ConfirmPersonalUserPhoneEmailComponent', () => {
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
  const actionMock = {
    label: '',
    value: '',
    action: '',
    type: ActionType.editPhoneNumber,
  };


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [
        ConfirmPersonalUserPhoneEmailComponent,
        ConfirmPersonalUserScreenLayoutComponent,
        FormatPhonePipe,
      ],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneEmailComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.data = mockData;
    fixture.detectChanges();
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
