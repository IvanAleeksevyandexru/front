import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocInputComponent } from './doc-input.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListModule } from '../../components-list.module';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { MockComponent, MockModule } from 'ng-mocks';
import { BaseModule } from '../../../../shared/base.module';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { EpguLibModule } from 'epgu-lib';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
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
          date: { attrs: { validation: [] }}
        }
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(DocInputComponent)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        ComponentsListFormService,
        ComponentsListToolsService,
        UnsubscribeService,
        DatesToolsService,
        ValidationService,
        DateRangeService,
        HtmlRemoverService,
        CurrentAnswersService,
        AutocompleteApiService,
        DictionaryToolsService,
        RefRelationService
      ],
      imports: [
        RouterTestingModule,
        BaseModule,
        MockModule(EpguLibModule),
        ComponentsListModule
      ],
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
