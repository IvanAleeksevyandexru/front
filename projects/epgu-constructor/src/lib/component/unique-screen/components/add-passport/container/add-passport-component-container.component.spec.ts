import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  EventBusService,
  FocusManagerService,
  FocusManagerServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ComponentBase } from '../../../../../screen/screen.types';
import { PassportModule } from '../../../../../shared/components/add-passport/passport.module';
import { ScreenPadComponent, HealthService } from '@epgu/epgu-constructor-ui-kit';
import { Passport } from '../add-passport.models';
import { AddPassportComponent } from '../component/add-passport.component';
import { AddPassportContainerComponent } from './add-passport-component-container.component';
import { DefaultUniqueScreenWrapperComponent } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { SuggestHandlerService } from '../../../../../shared/services/suggest-handler/suggest-handler.service';
import { configureTestSuite } from 'ng-bullet';
import { SuggestMonitorService } from '../../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { HttpClientModule } from '@angular/common/http';

describe('AddPassportContainerComponent', () => {
  let component: AddPassportContainerComponent;
  let fixture: ComponentFixture<AddPassportContainerComponent>;
  let currentAnswersService: CurrentAnswersService;
  const mockData: ComponentBase = {
    attrs: { fields: [] },
    id: '',
    label: '',
    type: '',
    value: '{}', // json-string friendly
    visited: false,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddPassportContainerComponent,
        AddPassportComponent,
        ScreenPadComponent,
        MockComponent(DefaultUniqueScreenWrapperComponent),
      ],
      imports: [
        RouterTestingModule,
        PassportModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
      ],
      providers: [
        CurrentAnswersService,
        HealthService,
        EventBusService,
        SuggestMonitorService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        SuggestHandlerService,
        { provide: FocusManagerService, useClass: FocusManagerServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportContainerComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change currentAnswersService state', () => {
    const data: Passport = {
      value: {
        rfPasportNumber: '435345',
        rfPasportSeries: '3454',
      },
      isValid: true,
    };
    component.onPassportDataChange(data);
    expect(currentAnswersService.state).toEqual(JSON.stringify(data.value));
    expect(currentAnswersService.isValid).toEqual(data.isValid);
  });
});
