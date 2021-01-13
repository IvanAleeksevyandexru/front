import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ComponentBase } from '../../../../../screen/screen.types';
import { PassportModule } from '../../../../../shared/components/add-passport/passport.module';
import { AddPassportContainerComponent } from './add-passport-component-container.component';
import { AddPassportComponent } from '../component/add-passport.component';
import { Passport } from '../add-passport.models';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { EventBusService } from '../../../../../form-player/services/event-bus/event-bus.service';

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

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPassportContainerComponent, AddPassportComponent, ScreenPadComponent],
      imports: [RouterTestingModule, PassportModule, ReactiveFormsModule, FormsModule],
      providers: [
        CurrentAnswersService,
        HealthService,
        EventBusService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  }));

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
