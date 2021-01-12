import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { of } from 'rxjs';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../../form-player/services/event-bus/event-bus.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ComponentBase } from '../../../../../screen/screen.types';
import { PassportModule } from '../../../../../shared/components/add-passport/passport.module';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { ComponentListToolsService } from '../../../../components-list/services/component-list-tools/component-list-tools.service';
import { AddPassportContainerComponent } from './add-passport-component-container.component';
import { PassportFormFields } from '../../../../../shared/components/add-passport/passport.interface';
import { AddPassportComponent } from '../component/add-passport.component';

describe('AddPassportContainerComponent', () => {
  let component: AddPassportContainerComponent;
  let fixture: ComponentFixture<AddPassportContainerComponent>;
  let currentAnswersService: CurrentAnswersService;
  let eventBusService: EventBusService;
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
      declarations: [AddPassportContainerComponent, ScreenPadComponent, AddPassportComponent],
      imports: [RouterTestingModule, PassportModule],
      providers: [
        CurrentAnswersService,
        ComponentListToolsService,
        HealthService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        UnsubscribeService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportContainerComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    eventBusService = TestBed.inject(EventBusService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call onPassportDataChange()', () => {
    spyOn(component, 'onPassportDataChange').and.callThrough();
    eventBusService.emit('passportValueChangedEvent');
    expect(component.onPassportDataChange).toHaveBeenCalled();
  });

  // it('should change currentAnswersService state', () => {
  //   const data: PassportFormFields = {
  //     rfPasportNumber: '435345',
  //     rfPasportSeries: '3454',
  //   };
  //   component.onPassportDataChange(data);
  //   expect(currentAnswersService.state).toEqual(data);
  // });
});
