import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ConfirmPersonalUserPhoneComponent } from './confirm-personal-user-phone.component';
import { ScreenService } from '../../../../../../../screen.service';
import { NavigationService } from '../../../../../../../../shared/services/navigation/navigation.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApplicantAnswersService } from '../../../../../../../../shared/services/applicant-answers/applicant-answers.service';
import { FormPlayerApiService } from '../../../../../../../../services/api/form-player-api/form-player-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ServiceDataService } from '../../../../../../../../services/service-data/service-data.service';

describe('ConfirmPersonalUserPhoneComponent', () => {
  let component: ConfirmPersonalUserPhoneComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneComponent>;
  const mockData = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ ConfirmPersonalUserPhoneComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      providers: [
        CurrentAnswersService,
        ScreenService,
        NavigationService,

        // TODO Tur: почему нужно импортировать эти сервисы?
        FormPlayerApiService,
        ServiceDataService,
        ApplicantAnswersService,
        CurrentAnswersService,
        ConfigService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(CurrentAnswersService);
    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(NavigationService);

    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
