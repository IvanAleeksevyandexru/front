import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import {
  ConfigService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ModalBaseComponent,
} from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal.component';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { Clarifications } from '@epgu/epgu-constructor-types';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ModalService, ModalServiceStub, CtaModalComponent } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../../../../core/services/html-select/html-select.service';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { JsonHelperServiceStub } from '../../../../../../core/services/json-helper/json-helper.service.stub';
import { ClickableLabelDirective } from 'projects/epgu-constructor/src/lib/shared/directives/clickable-label/clickable-label.directive';

describe('PhotoRequirementsModalComponent', () => {
  let component: PhotoRequirementsModalComponent;
  let fixture: ComponentFixture<PhotoRequirementsModalComponent>;
  const clarifications: Clarifications = {
    requirements: {
      type: 'UniqueModal',
      id: 'PhotoRequirements',
      setting: {
        warning:
          'Убедитесь, что ваша фотография соответствует требованиям ведомства. Это важно, чтобы заявление приняли.',
        body: [
          {
            title: '<b>Фотография ребёнка</b>',
            text:
              'К фото ребёнка те же требования, что и к фото взрослого. Ребёнок в кадре должен быть один, без посторонних предметов.',
            type: 'child',
            examplePhotos: [{ valid: true, description: 'Смотрит прямо', type: 'eyes-forward' }],
          },
        ],
        footer: '<a id="howtotakephoto">Как сделать фото самостоятельно</a>',
      },
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhotoRequirementsModalComponent,
        MockComponent(CtaModalComponent),
        MockDirective(ClickableLabelDirective),
      ],
      imports: [BaseModule, BaseComponentsModule],
      providers: [
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CurrentAnswersService,
        EventBusService,
        HtmlSelectService,
        SmuEventsService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoRequirementsModalComponent);
    component = fixture.componentInstance;
    component.clarifications = clarifications;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend ModalBaseComponent', () => {
    expect(component).toBeInstanceOf(ModalBaseComponent);
  });

  it('should create buttons', () => {
    expect(component.buttons.length).toBeGreaterThan(0);
  });
});
