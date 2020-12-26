import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ToJsonPipe } from '../../../../../../../../shared/pipes/to-json/to-json.pipe';
import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ActionType } from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ActionDirective } from '../../../../../../../../shared/directives/action/action.directive';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { SafePipe } from 'projects/epgu-constructor/src/app/core/pipes/safe/safe.pipe';
import { FieldListComponent } from 'projects/epgu-constructor/src/app/shared/components/field-list/field-list.component';
import { of } from 'rxjs';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenPadComponent } from '../../../../../../../../shared/components/screen-pad/screen-pad.component';

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
          action: '',
        },
      ],
      fields: [
        {
          fieldName: 'birthDate',
          label: 'Birthday Date',
        },
      ],
      style: {
        divider: '',
        list: '',
        field: '',
        group: '',
        groupTitle: '',
        label: '',
        value: '',
      },
    },
    type: '',
    value: '{}',
    presetValue: '{}',
    label: '',
    id: '',
  };
  const actionMock = {
    label: '',
    value: '',
    action: '',
    type: ActionType.nextStep,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ConfirmPersonalUserDataComponent,
          ScreenPadComponent,
          ToJsonPipe,
          ActionDirective,
          FieldListComponent,
          SafePipe,
        ],
        providers: [
          CurrentAnswersService,
          UnsubscribeService,
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: ScreenService, useClass: ScreenServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.data$ = of(mockData);
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
