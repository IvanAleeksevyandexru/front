import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { ComponentAttrsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { PassportModule } from '../../../../../shared/components/add-passport/passport.module';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
// eslint-disable-next-line max-len
import { ComponentListToolsService } from '../../../../../shared/services/component-list-tools/component-list-tools.service';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { AddPassportComponent } from './add-passport.component';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { ModalService } from '../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../modal/modal.service.stub';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';

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

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPassportComponent, ScreenPadComponent],
      imports: [RouterTestingModule, PassportModule, ReactiveFormsModule, FormsModule],
      providers: [
        ComponentListToolsService,
        HealthService,
        EventBusService,
        ValidationService,
        DateRangeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DatesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService
      ],
    }).compileComponents();
  }));

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
