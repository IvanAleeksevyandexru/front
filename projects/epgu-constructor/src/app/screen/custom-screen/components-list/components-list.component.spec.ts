import { ComponentsListComponent } from './components-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../screen.service';
import { ConfigService } from '../../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApplicantAnswersService } from '../../../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../../../services/component-state/component-state.service';
import { FormsModule } from '@angular/forms';


describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ComponentsListComponent ],
      providers: [
        DictionaryApiService,
        ScreenService,
        ConfigService,
        // почему надо импортить этот сервис?
        ApplicantAnswersService,
        ComponentStateService,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(DictionaryApiService);
    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(ConfigService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
