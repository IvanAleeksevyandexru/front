import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';

import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  ActionType,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { OutputHtmlModule } from '../../../../../../shared/components/output-html/output-html.module';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';

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
          action: DTOActionAction.getNextStep,
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
        declarations: [ConfirmPersonalUserDataComponent],
        imports: [
          MockModule(OutputHtmlModule),
          MockModule(DefaultUniqueScreenWrapperModule),
          MockModule(BaseComponentsModule),
          MockModule(BaseModule),
          MockModule(FieldListModule),
          MockModule(ScreenPadModule),
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
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock as any);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
