import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../core/services/utils/utils.service.stub';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import {
  ActionApiResponse,
  ActionType,
  ComponentActionDto,
  ComponentDto,
  DTOActionAction
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ActionDirective } from './action.directive';




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
  let comp: ActionTestComponent;
  let formPlayerApiService: FormPlayerApiService;
  let screenService: ScreenService;
  let navigationService: NavigationService;
  let navigationModalService: NavigationModalService;
  let utilsService: UtilsService;
  let localStorageService: LocalStorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDirective, ActionTestComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        HtmlRemoverService,
        CurrentAnswersService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ActionTestComponent);
        comp = fixture.componentInstance;
        formPlayerApiService = TestBed.inject(FormPlayerApiService);
        screenService = TestBed.inject(ScreenService);
        navigationService = TestBed.inject(NavigationService);
        navigationModalService = TestBed.inject(NavigationModalService);
        utilsService = TestBed.inject(UtilsService);
        localStorageService = TestBed.inject(LocalStorageService);
        jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
        jest.spyOn(formPlayerApiService, 'sendAction').mockReturnValue(sendActionMock);
      });
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
    spyOn(navigationService, 'redirectToLK').and.callThrough();
    button.click();

    expect(navigationService.redirectToLK).toHaveBeenCalled();
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
        value: ''
      }
    };

    expect(localStorageService.set).toHaveBeenCalledWith(QUIZ_SCENARIO_KEY, { applicantAnswers });
    expect(navigationService.redirectTo).toHaveBeenCalledWith('/to-some-order');
  });
});
