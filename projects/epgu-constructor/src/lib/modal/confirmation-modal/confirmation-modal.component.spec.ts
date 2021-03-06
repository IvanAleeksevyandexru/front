import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  CtaModalComponent,
  BaseUiModule,
  LocationService,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockComponents, MockDirectives } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { NotifierService } from '@epgu/ui/services/notifier';
import { ActionType, CloseHandlerCases, DTOActionAction } from '@epgu/epgu-constructor-types';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { OutputHtmlComponent } from '../../shared/components/output-html/output-html.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { ScreenButtonsComponent } from '../../shared/components/screen-buttons/screen-buttons.component';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ForTestsOnlyModule } from '../../core/for-tests-only.module';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let clipboard: Clipboard;
  let notifierService: NotifierService;
  let navigationService: NavigationService;
  let locationService: LocationService;
  let eventBusService: EventBusService;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  const initComponent = () => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    clipboard = TestBed.inject(Clipboard);
    notifierService = TestBed.inject(NotifierService);
    component.showCloseButton = false;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationModalComponent,
        MockComponents(CtaModalComponent, OutputHtmlComponent, ScreenButtonsComponent),
        MockDirectives(ActionDirective),
      ],
      imports: [BaseUiModule, AnswerButtonModule, ForTestsOnlyModule],
      providers: [],
    })
      .overrideComponent(ConfirmationModalComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    initComponent();
    // eslint-disable-next-line no-empty-function
    component.detachView = () => {};
    fixture.detectChanges();
    navigationService = TestBed.inject(NavigationService);
    locationService = TestBed.inject(LocationService);
    eventBusService = TestBed.inject(EventBusService);
  });

  it('should render epgu-cf-ui-cta-modal', () => {
    const selector = 'epgu-cf-ui-cta-modal';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.showButtons).toBeFalsy();
    expect(debugEl.componentInstance.title).toBeUndefined();
    expect(debugEl.componentInstance.text).toBeUndefined();

    expect(debugEl.componentInstance.showCrossButton).toBeFalsy(); // ???????????? ?????? title ???? ????????????????
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
    expect(debugEl.componentInstance.showCrossButton).toBeTruthy(); // ???????????? ?????? title ????????????????
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

    component.showCloseButton = true;
    component.buttons = [{ label: '??????????????', closeModal: true }];
    component.ngAfterViewInit();
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
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
      const message = '?????? ???????????? ????????????????????';
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

  describe('eventBusService cases', () => {
    it('should call closeModal for closeModalEventGlobal', () => {
      const spy = jest.spyOn(component, 'closeModal');
      eventBusService.emit('closeModalEventGlobal');
      expect(spy).toBeCalled();
    });
  });
});
