import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../../../../../shared/config/config.service';
import { ConfigServiceStub } from '../../../../../../../../shared/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ToJsonPipe } from '../../../../../../../../shared/pipes/toJson/to-json.pipe';
import { ConfirmUserData } from '../../../../../../types/confirm-user-data.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ScreenService } from '../../../../../../../screen.service';
import { ActionType } from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ActionDirective } from '../../../../../../../../shared/directives/action/action.directive';
import { ScreenServiceStub } from '../../../../../../../screen.service.stub';


describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;
  let screenService: ScreenService;
  const mockData: ConfirmUserData = {
    attrs: {
      actions: [
        {
          label: '',
          value: '',
          action: ''
        }
      ],
      fields: [
        {
          fieldName: 'birthDate',
          label: 'Birthday Date'
        }
      ]
    },
    type: '',
    value: '',
    label: '',
    id: ''
  };
  const actionMock = {
    label: '',
    value: '',
    action: '',
    type: ActionType.nextStep
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserDataComponent, ToJsonPipe, ActionDirective],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.data = mockData;
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
