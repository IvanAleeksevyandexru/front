import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../../../../core/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ToJsonPipe } from '../../../../../../../../shared/pipes/toJson/to-json.pipe';
import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ActionType } from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ActionDirective } from '../../../../../../../../shared/directives/action/action.directive';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { SharedModule } from 'projects/epgu-constructor/src/app/shared/shared.module';
import { SafePipe } from 'projects/epgu-constructor/src/app/core/pipes/safe/safe.pipe';
import { FieldListComponent } from 'projects/epgu-constructor/src/app/shared/components/field-list/field-list.component';


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
    value: '{}',
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
      declarations: [
        ConfirmPersonalUserDataComponent,
        ToJsonPipe,
        ActionDirective,
        FieldListComponent,
        SafePipe,
      ],
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
