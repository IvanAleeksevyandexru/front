import { MockProvider } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocInputComponent } from './doc-input.component';
import { ComponentsListModule } from '../../components-list.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { MockComponent, MockModule } from 'ng-mocks';
import { BaseModule } from '../../../../shared/base.module';
import {
  ConfigService, ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  DatesToolsService
} from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { EpguLibModule } from '@epgu/epgu-lib';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { configureTestSuite } from 'ng-bullet';

//TODO написать тесты
describe('DocInputComponent', () => {
  let component: DocInputComponent;
  let fixture: ComponentFixture<DocInputComponent>;
  const mockData = {
    value: {
      attrs: {
        fields: {
          series: { attrs: { validation: [] }},
          number: { attrs: { validation: [] }},
          emitter: { attrs: { validation: [] }},
          date: { attrs: { validation: [] }},
        },
      },
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(DocInputComponent)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        MockProvider(ComponentsListFormService),
        DatesToolsService,
        HtmlRemoverService,
        CurrentAnswersService,
        AutocompleteApiService,
        RefRelationService,
      ],
      imports: [RouterTestingModule, BaseModule, MockModule(EpguLibModule), ComponentsListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
