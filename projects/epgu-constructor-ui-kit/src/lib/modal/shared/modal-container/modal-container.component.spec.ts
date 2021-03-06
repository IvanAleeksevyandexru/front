import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmationModalModule } from '../../../../../../epgu-constructor/src/lib/modal/confirmation-modal/confirmation-modal.module';
import { MockComponents, MockModule, MockProvider } from 'ng-mocks';
import { ScreenButtonsComponent } from '../../../../../../epgu-constructor/src/lib/shared/components/screen-buttons/screen-buttons.component';
import { AnswerButtonModule } from '../../../../../../epgu-constructor/src/lib/shared/components/answer-button/answer-button.module';
import { NavigationService } from '../../../../../../epgu-constructor/src/lib/core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../../../epgu-constructor/src/lib/core/services/navigation/navigation.service.stub';
import { ConfirmationModalComponent } from '../../../../../../epgu-constructor/src/lib/modal/confirmation-modal/confirmation-modal.component';
import { CurrentAnswersService } from '../../../../../../epgu-constructor/src/lib/screen/current-answers.service';
import { HtmlSelectService } from '../../../../../../epgu-constructor/src/lib/core/services/html-select/html-select.service';
import { ModalContainerComponent } from './modal-container.component';
import { ModalService } from '../../modal.service';
import { CtaModalComponent } from '../cta-modal/cta-modal.component';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { BaseUiModule } from '../../../base/base-ui.module';
import { LocationService } from '../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../core/services/location/location.service.stub';
import { ScreenService } from '../../../../../../epgu-constructor/src/lib/screen/screen.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

const blankModalParameters = {
  clarifications: {},
  componentId: undefined,
  showCrossButton: true,
  text: '',
  title: '',
};

describe('ModalContainerComponent', () => {
  let component: ModalContainerComponent;
  let fixture: ComponentFixture<ModalContainerComponent>;
  let service: ModalService;

  const initComponent = () => {
    fixture = TestBed.createComponent(ModalContainerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ModalService);
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MockComponents(CtaModalComponent, ScreenButtonsComponent)],
        imports: [
          ConfirmationModalModule,
          MockModule(BaseUiModule),
          MockModule(AnswerButtonModule),
        ],
        providers: [
          EventBusService,
          ModalService,
          { provide: LocationService, useClass: LocationServiceStub },
          { provide: NavigationService, useClass: NavigationServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          MockProvider(CurrentAnswersService),
          MockProvider(HtmlSelectService),
          MockProvider(JsonHelperService),
          MockProvider(ScreenService),
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    initComponent();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render modal in container', () => {
    const modalContainer = fixture.debugElement.query(By.css('#modal-container'));
    const { nativeElement } = fixture.debugElement;

    expect(modalContainer).toBeTruthy();
    expect(nativeElement.querySelector('.modal-overlay')).toBeFalsy();
    expect(nativeElement.querySelector('epgu-cf-ui-cta-modal')).toBeFalsy();

    service.openModal(ConfirmationModalComponent, blankModalParameters);
    fixture.detectChanges();

    expect(nativeElement.querySelector('.modal-overlay')).toBeTruthy();
    expect(nativeElement.querySelector('epgu-cf-ui-cta-modal')).toBeTruthy();
  });
});
