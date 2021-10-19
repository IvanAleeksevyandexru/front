import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DropdownListModalComponent } from './dropdown-list-modal.component';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { BaseModule } from '../../../shared/base.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { ActionService } from '../../../shared/directives/action/action.service';
import { ConfirmationModalModule } from '../../confirmation-modal/confirmation-modal.module';
import { HighlightModule } from '@epgu/ui/pipes';

const dropdownData = {
  title: 'Категории граждан и условия для досрочного назначения пенсии',
  items: [
    {
      label:
        'Мужчины и женщины, осуществлявшие педагогическую деятельность в учреждениях для детей',
      content: 'Если имеют стаж по профессии не менее 25 лет',
      tags: [],
    },
  ],
};

const components = [
  {
    id: 'string',
    type: 'StringInput',
    attrs: {},
    value: '',
    required: true,
  },
  {
    id: 'html-string',
    type: 'HtmlString',
    label: '<a data-action-value="test"></a>',
    attrs: {
      clarifications: {
        test: {
          title: 'Как определить тип стажа',
          text:
            '<a data-action-type="dropdownListModal" data-action-value="dropdownListModal">Список</a>',
        },
        dropdownListModal: dropdownData,
      },
    },
    value: '',
    required: true,
  },
];

describe('DropdownListModalComponent', () => {
  let component: DropdownListModalComponent;
  let fixture: ComponentFixture<DropdownListModalComponent>;
  let screenService: ScreenService;
  let eventBusService: EventBusService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownListModalComponent, DropdownListComponent, FilterPipe],
      imports: [MockModule(BaseModule), MockModule(ConfirmationModalModule), HighlightModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        UnsubscribeService,
        MockProvider(ActionService),
      ],
    })
      .overrideComponent(DropdownListModalComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    fixture = TestBed.createComponent(DropdownListModalComponent);
    component = fixture.componentInstance;
    component.componentId = 'html-string';
    component.clarificationId = 'dropdownListModal';
  });

  it('should create for repeatable screen', (done) => {
    screenService.display = {
      type: 'UNIQUE',
      components: [
        {
          id: 'repeatable',
          type: 'RepeatableFields',
          attrs: { components },
          value: '',
          required: true,
        },
      ],
    } as any;
    fixture.detectChanges();
    component.data$.subscribe((data) => {
      expect(data).toEqual(dropdownData);
      done();
    });
  });

  it('should create for custom screen', (done) => {
    screenService.display = {
      type: 'CUSTOM',
      components,
    } as any;
    fixture.detectChanges();
    component.data$.subscribe((data) => {
      expect(data).toEqual(dropdownData);
      done();
    });
  });

  it('should be empty data', (done) => {
    screenService.display = {
      type: 'CUSTOM',
      components: [{ id: 'string' }],
    } as any;
    fixture.detectChanges();
    component.data$.subscribe((data) => {
      expect(data).toBe(null);
      done();
    });
  });

  it('should call close modal', () => {
    jest.spyOn(component, 'closeModal');
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    eventBusService.on('closeModalEvent_dr_modal').subscribe(() => {
      expect(component.closeModal).toBeCalledTimes(0);
    });
  });
});
