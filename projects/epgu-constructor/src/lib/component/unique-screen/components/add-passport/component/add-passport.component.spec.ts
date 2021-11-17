import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  ScreenPadComponent,
  ConfigService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  FocusManagerService,
  FocusManagerServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { PassportModule } from '../../../../../shared/components/add-passport/passport.module';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { ComponentsListToolsService } from '../../../../custom-screen/services/components-list-tools/components-list-tools.service';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { AddPassportComponent } from './add-passport.component';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { SuggestHandlerService } from '../../../../../shared/services/suggest-handler/suggest-handler.service';
import { DateRestrictionsService } from '../../../../../shared/services/date-restrictions/date-restrictions.service';
import { SuggestMonitorService } from '../../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { HtmlSelectService } from '../../../../../core/services/html-select/html-select.service';
import { MockProvider } from 'ng-mocks';
import { JsonHelperService } from '../../../../../core/services/json-helper/json-helper.service';
import { JsonHelperServiceStub } from '../../../../../core/services/json-helper/json-helper.service.stub';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { HealthService } from '@epgu/ui/services/health';
import { HttpClientModule } from '@angular/common/http';

describe('AddPassportComponent', () => {
  let component: AddPassportComponent;
  let fixture: ComponentFixture<AddPassportComponent>;
  const mockData: ComponentAttrsDto = {
    participant: {
      role: 'ChildrenAbove14',
      mode: 'SlaveApplicant',
    },
    fields: [
      {
        mask: ['/\\d/', '/\\d/', '/\\d/', '/\\d/'],
        fieldName: 'rfPasportSeries',
        label: 'Серия',
        type: 'input',
        regexp: '^[0-9]{4}$',
        errorMsg: 'Поле должно содержать 4 цифры',
      },
      {
        mask: ['/\\d/', '/\\d/', '/\\d/', '/\\d/', '/\\d/', '/\\d/'],
        fieldName: 'rfPasportNumber',
        label: 'Номер',
        type: 'input',
        regexp: '^[0-9]{6}$',
        errorMsg: 'Поле должно содержать 6 цифр',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPassportComponent, ScreenPadComponent],
      imports: [
        RouterTestingModule,
        PassportModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
      ],
      providers: [
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FocusManagerService, useClass: FocusManagerServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        MockProvider(DateRestrictionsService),
        ComponentsListToolsService,
        CurrentAnswersService,
        DateRangeService,
        DatesToolsService,
        EventBusService,
        HealthService,
        HtmlSelectService,
        SmuEventsService,
        SuggestHandlerService,
        SuggestMonitorService,
        ValidationService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportComponent);
    component = fixture.componentInstance;
    component.attrs = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
