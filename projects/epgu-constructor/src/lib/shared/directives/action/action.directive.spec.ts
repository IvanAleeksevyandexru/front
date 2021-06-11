import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { UtilsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ActionDirective } from './action.directive';
import { ActionService } from './action.service';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ActionApiResponse,
  ComponentDto,
} from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-action-test',
  template: `
    <button class="download" epgu-constructor-action [action]="downloadAction"></button>
    <button class="prevStepModal" epgu-constructor-action [action]="prevStepModalAction"></button>
    <button class="nextStepModal" epgu-constructor-action [action]="nextStepModalAction"></button>
    <button class="skipStep" epgu-constructor-action [action]="skipStepAction"></button>
    <button class="prevStep" epgu-constructor-action [action]="prevStepAction"></button>
    <button class="nextStep" epgu-constructor-action [action]="nextStepAction"></button>
    <button class="redirectToLK" epgu-constructor-action [action]="redirectToLKAction"></button>
    <button class="profileEdit" epgu-constructor-action [action]="profileEditAction"></button>
    <button class="home" epgu-constructor-action [action]="homeAction"></button>
    <button class="quizToOrder" epgu-constructor-action [action]="quizToOrder"></button>
    <button class="prev" name="prev" epgu-constructor-action [action]="prevStepAction"></button>
    <button class="empty" epgu-constructor-action [action]="emptyAction"></button>
  `,
})
export class ActionTestComponent {
  downloadAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.download,
  };
  prevStepModalAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.prevStepModal,
  };
  nextStepModalAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.nextStepModal,
  };
  skipStepAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.skipStep,
  };
  prevStepAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.prevStep,
  };
  nextStepAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.nextStep,
  };
  redirectToLKAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.redirectToLK,
  };
  profileEditAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.profileEdit,
  };
  homeAction: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.home,
  };
  quizToOrder: ComponentActionDto = {
    label: '',
    value: '',
    action: '/to-some-order' as DTOActionAction,
    type: ActionType.quizToOrder,
  };
  emptyAction: ComponentActionDto = undefined;
}

const mockComponent: ComponentDto = {
  attrs: {},
  label: '',
  type: '',
  id: '12',
  value: '',
};

const sendActionMock = of({
  errorList: [],
  responseData: { value: 'value', type: 'type' },
}) as Observable<ActionApiResponse<string>>;

describe('ActionDirective', () => {
  let fixture: ComponentFixture<ActionTestComponent>;
  let component: ActionTestComponent;
  let formPlayerApiService: FormPlayerApiService;
  let screenService: ScreenService;
  let navigationService: NavigationService;
  let navigationModalService: NavigationModalService;
  let utilsService: UtilsService;
  let localStorageService: LocalStorageService;
  let actionService: ActionService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDirective, ActionTestComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        HtmlRemoverService,
        CurrentAnswersService,
        ActionService,
        AutocompleteApiService,
        HttpClient,
        HttpHandler,
        EventBusService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTestComponent);
    component = fixture.componentInstance;
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    screenService = TestBed.inject(ScreenService);
    navigationService = TestBed.inject(NavigationService);
    navigationModalService = TestBed.inject(NavigationModalService);
    utilsService = TestBed.inject(UtilsService);
    localStorageService = TestBed.inject(LocalStorageService);
    actionService = TestBed.inject(ActionService);
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(formPlayerApiService, 'sendAction').mockReturnValue(sendActionMock);
  });

  it('test directive - download action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.download')).nativeElement;
    fixture.detectChanges();
    spyOn(utilsService, 'downloadFile').and.callThrough();
    button.click();

    expect(utilsService.downloadFile).toHaveBeenCalled();
  });

  it('test directive - prevStepModal Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStepModal')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationModalService, 'prev').and.callThrough();
    button.click();

    expect(navigationModalService.prev).toHaveBeenCalled();
  });

  it('test directive - nextStepModal Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStepModal')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationModalService, 'next').and.callThrough();
    button.click();

    expect(navigationModalService.next).toHaveBeenCalled();
  });

  it('test directive - skipStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.skipStep')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'skip').and.callThrough();
    button.click();

    expect(navigationService.skip).toHaveBeenCalled();
  });

  it('test directive - nextStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStep')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'next').and.callThrough();
    button.click();

    expect(navigationService.next).toHaveBeenCalled();
  });

  it('test directive - prevStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStep')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'prev').and.callThrough();
    button.click();

    expect(navigationService.prev).toHaveBeenCalled();
  });

  it('test directive - redirectToLK Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.redirectToLK')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'redirectToLKByOrgType').and.callThrough();
    button.click();

    expect(navigationService.redirectToLKByOrgType).toHaveBeenCalled();
  });

  it('test directive - profileEdit Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.profileEdit')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'redirectToProfileEdit').and.callThrough();
    button.click();

    expect(navigationService.redirectToProfileEdit).toHaveBeenCalled();
  });

  it('test directive - home Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.home')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'redirectToHome').and.callThrough();
    button.click();

    expect(navigationService.redirectToHome).toHaveBeenCalled();
  });

  it('test directive - quizToOrder Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.quizToOrder')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService, 'redirectTo').and.callThrough();
    spyOn(screenService, 'getStore').and.returnValue({ applicantAnswers: {}});
    spyOn(localStorageService, 'set').and.callThrough();
    button.click();

    const applicantAnswers = {
      12: {
        visited: true,
        value: '',
      },
    };

    expect(localStorageService.set).toHaveBeenCalledWith(QUIZ_SCENARIO_KEY, { applicantAnswers });
    expect(navigationService.redirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('test directive - empty Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.empty')).nativeElement;
    fixture.detectChanges();
    const switchSpy = spyOn(actionService, 'switchAction').and.callThrough();
    button.click();
    expect(switchSpy).not.toBeCalled();
  });

  describe('onKeyDown', () => {
    it('should not call switchAction with name=prev', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      const switchActionSpy = jest.spyOn(actionService, 'switchAction');
      const button = fixture.debugElement.query(By.css('.prev'));
      fixture.detectChanges();
      button.nativeElement.dispatchEvent(event);
      expect(switchActionSpy).not.toBeCalled();
    });

    it('should not call switchAction with empty action', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      const switchActionSpy = jest.spyOn(actionService, 'switchAction');
      const button = fixture.debugElement.query(By.css('.empty'));
      fixture.detectChanges();
      button.nativeElement.dispatchEvent(event);
      expect(switchActionSpy).not.toBeCalled();
    });
  });
});
