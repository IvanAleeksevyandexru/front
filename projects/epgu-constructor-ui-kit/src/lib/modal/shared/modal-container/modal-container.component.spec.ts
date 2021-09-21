import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalContainerComponent } from './modal-container.component';
import { ModalService } from '../../modal.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { ConfirmationModalComponent } from '@epgu/epgu-constructor/src/lib/modal/confirmation-modal/confirmation-modal.component';
import { MockComponents, MockDirectives, MockModule } from 'ng-mocks';
import { CtaModalComponent } from '../cta-modal/cta-modal.component';
import { OutputHtmlComponent } from '@epgu/epgu-constructor/src/lib/shared/components/output-html/output-html.component';
import { ScreenButtonsComponent } from '@epgu/epgu-constructor/src/lib/shared/components/screen-buttons/screen-buttons.component';
import { ActionDirective } from '@epgu/epgu-constructor/src/lib/shared/directives/action/action.directive';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { BaseUiModule } from '../../../base/base-ui.module';

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
        declarations: [
          ConfirmationModalComponent,
          ModalContainerComponent,
          MockComponents(CtaModalComponent, OutputHtmlComponent, ScreenButtonsComponent),
          MockDirectives(ActionDirective),
        ],
        imports: [MockModule(BaseUiModule)],
        providers: [
          EventBusService,
          ModalService,
          { provide: ConfigService, useClass: ConfigServiceStub },
        ],
      })
        .overrideModule(BrowserDynamicTestingModule, {
          set: {
            entryComponents: [ConfirmationModalComponent],
          },
        })
        .compileComponents();
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
    const nativeElement = fixture.debugElement.nativeElement;

    expect(modalContainer).toBeTruthy();
    expect(nativeElement.querySelector('.modal-overlay')).toBeFalsy();
    expect(nativeElement.querySelector('epgu-cf-ui-cta-modal')).toBeFalsy();

    service.openModal(ConfirmationModalComponent, blankModalParameters);
    fixture.detectChanges();

    expect(nativeElement.querySelector('.modal-overlay')).toBeTruthy();
    expect(nativeElement.querySelector('epgu-cf-ui-cta-modal')).toBeTruthy();
  });
});
