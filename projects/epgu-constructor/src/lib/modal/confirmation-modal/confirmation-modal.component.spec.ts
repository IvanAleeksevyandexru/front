import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  ConfigService,
  ConfigServiceStub,
  CtaModalComponent,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
  BaseUiModule,
  DownloadService,
  LocationService,
  LocationServiceStub,
  ModalService,
  ObjectHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../screen/screen.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { FormPlayerApiServiceStub } from '../../form-player/services/form-player-api/form-player-api.service.stub';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationModalService } from '../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../core/services/navigation-modal/navigation-modal.service.stub';
import { MockComponents, MockDirectives, MockProvider } from 'ng-mocks';
import { OutputHtmlComponent } from '../../shared/components/output-html/output-html.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { ScreenButtonsComponent } from '../../shared/components/screen-buttons/screen-buttons.component';
import { By } from '@angular/platform-browser';
import { NotifierService } from '@epgu/ui/services/notifier';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { ActionService } from '../../shared/directives/action/action.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { HtmlSelectService } from '../../core/services/html-select/html-select.service';
import { JsonHelperService } from '../../core/services/json-helper/json-helper.service';
import { ActionType, CloseHandlerCases, DTOActionAction } from '@epgu/epgu-constructor-types';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let clipboard: Clipboard;
  let notifierService: NotifierService;
  let navigationService: NavigationService;
  let locationService: LocationService;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  const initComponent = () => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    clipboard = TestBed.inject(Clipboard);
    notifierService = TestBed.inject(NotifierService);

    // без этого будет ошибка
    // Expression has changed after it was checked. Previous value: 'showButtons: false'. Current value: 'showButtons: true'
    // из-за этого, что в ngAfterViewInit меняется showCloseButton
    component.showCloseButton = false;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConfirmationModalComponent,
        MockComponents(CtaModalComponent, OutputHtmlComponent, ScreenButtonsComponent),
        MockDirectives(ActionDirective),
      ],
      imports: [BaseUiModule, AnswerButtonModule],
      providers: [
        EventBusService,
        ModalService,
        DownloadService,
        ObjectHelperService,
        Clipboard,
        NotifierService,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        MockProvider(ActionService),
        MockProvider(CurrentAnswersService),
        MockProvider(HtmlSelectService),
        MockProvider(JsonHelperService),
      ],
    })
      .overrideComponent(ConfirmationModalComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    initComponent();
    // eslint-disable-next-line no-empty-function
    component['detachView'] = () => {};
    fixture.detectChanges();
    navigationService = TestBed.inject(NavigationService);
    locationService = TestBed.inject(LocationService);
  });

  it('should render epgu-cf-ui-cta-modal', () => {
    const selector = 'epgu-cf-ui-cta-modal';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.showButtons).toBeFalsy();
    expect(debugEl.componentInstance.title).toBeUndefined();
    expect(debugEl.componentInstance.text).toBeUndefined();

    expect(debugEl.componentInstance.showCrossButton).toBeFalsy(); // потому что title не объявлен
    expect(debugEl.componentInstance.preview).toBeUndefined();
    expect(debugEl.componentInstance.isShortModal).toBeUndefined();

    initComponent();

    component.preview = true;
    component.isShortModal = true;
    component.title = 'some title';
    component.text = 'some text';
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl.componentInstance.title).toBe('some title');
    expect(debugEl.componentInstance.text).toBe('some text');
    expect(debugEl.componentInstance.showCrossButton).toBeTruthy(); // потому что title объявлен
    expect(debugEl.componentInstance.preview).toBeTruthy();
    expect(debugEl.componentInstance.isShortModal).toBeTruthy();
  });

  it('should render epgu-constructor-output-html', () => {
    const selector = 'epgu-constructor-output-html';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.html).toBeUndefined();
    expect(debugEl.componentInstance.componentId).toBeUndefined();

    initComponent();
    component.text = 'some text';
    component.componentId = 'some component id';
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl.componentInstance.html).toBe('some text');
    expect(debugEl.componentInstance.componentId).toBe('some component id');
  });

  it('should render lib-button if showCloseButton', () => {
    const selector = 'lib-button';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeNull();

    // @todo. Не удается протестировать отображение кнопок при component.showCloseButton = true
    // из-за ошибки Expression has changed after it was checked. Previous value: 'showButtons: false'. Current value: 'showButtons: true'
  });

  it('should render epgu-constructor-screen-buttons if actionButtons is not empty', () => {
    const selector = 'epgu-constructor-screen-buttons';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeNull();

    component.actionButtons = [
      {
        label: 'some button label',
        action: DTOActionAction.editEmail,
        type: ActionType.legalEdit,
      },
    ];
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.screenButtons).toEqual([
      {
        label: 'some button label',
        action: DTOActionAction.editEmail,
        type: ActionType.legalEdit,
      },
    ]);
  });

  describe('copy()', () => {
    it('should call NotifierService with specific message', () => {
      const traceId = 'traceId';
      const message = 'Код ошибки скопирован';
      const spy = jest.spyOn(notifierService, 'success');
      component.copy(traceId);
      expect(spy).toBeCalledWith({ message });
    });
  });

  describe('close handle cases', () => {
    it('should call navigationService.prev', () => {
      const spy = jest.spyOn(navigationService, 'prev');
      component.closeHandlerCase = CloseHandlerCases.PREV_STEP;
      component.closeModal({});
      expect(spy).toBeCalled();
    });

    it('should call navigationService.redirectToLK', () => {
      const spy = jest.spyOn(navigationService, 'redirectToLK');
      component.closeHandlerCase = CloseHandlerCases.REDIRECT_TO_LK;
      component.closeModal({});
      expect(spy).toBeCalled();
    });

    it('should call locationService.reload', () => {
      const spy = jest.spyOn(locationService, 'reload');
      component.closeHandlerCase = CloseHandlerCases.RELOAD;
      component.closeModal({});
      expect(spy).toBeCalled();
    });
  });
});
