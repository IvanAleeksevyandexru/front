import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import {
  ConfigService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocationService,
  LocationServiceStub,
  SessionStorageService,
  SessionStorageServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { DownloadServiceStub } from '@epgu/epgu-constructor-ui-kit';
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
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ActionApiResponse,
  ComponentDto,
} from '@epgu/epgu-constructor-types';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { ActionToolsService } from './action-tools.service';

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
  let formPlayerApiService: FormPlayerApiService;
  let screenService: ScreenService;
  let navigationService: NavigationService;
  let navigationModalService: NavigationModalService;
  let downloadService: DownloadService;
  let localStorageService: LocalStorageService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDirective, ActionTestComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        HtmlRemoverService,
        CurrentAnswersService,
        ActionService,
        ActionToolsService,
        AutocompleteApiService,
        HttpClient,
        HttpHandler,
        EventBusService,
        EaisdoGroupCostService,
        JsonHelperService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTestComponent);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    screenService = TestBed.inject(ScreenService);
    navigationService = TestBed.inject(NavigationService);
    navigationModalService = TestBed.inject(NavigationModalService);
    downloadService = TestBed.inject(DownloadService);
    localStorageService = TestBed.inject(LocalStorageService);
    actionService = TestBed.inject(ActionService);
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(formPlayerApiService, 'sendAction').mockReturnValue(sendActionMock);

    screenService.display = new FormPlayerServiceStub()._store.scenarioDto.display;
  });

  it('test directive - download action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.download')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(downloadService, 'downloadFile');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - prevStepModal Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStepModal')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationModalService, 'prev');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - nextStepModal Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStepModal')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationModalService, 'next');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - skipStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.skipStep')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'skip');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - nextStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStep')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'next');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - prevStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStep')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'prev');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - redirectToLK Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.redirectToLK')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'redirectToLKByOrgType');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - profileEdit Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.profileEdit')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'redirectToProfileEdit');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - home Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.home')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'redirectToHome');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('test directive - quizToOrder Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.quizToOrder')).nativeElement;
    fixture.detectChanges();
    const spyRedirectTo = jest.spyOn(navigationService, 'redirectTo');
    jest.spyOn(screenService, 'getStore').mockReturnValue({ applicantAnswers: {}});
    const spySet = jest.spyOn(localStorageService, 'set');
    button.click();

    const applicantAnswers = {
      12: {
        visited: true,
        value: '',
      },
    };

    expect(spySet).toHaveBeenCalledWith(QUIZ_SCENARIO_KEY, { applicantAnswers });
    expect(spyRedirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('test directive - empty Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.empty')).nativeElement;
    fixture.detectChanges();
    const switchSpy = jest.spyOn(actionService, 'switchAction');
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
