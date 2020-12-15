import { inject, TestBed, ComponentFixture } from '@angular/core/testing';

import { ActionDirective } from './action.directive';

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../core/services/navigation-modal/navigation-modal.service.stub';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { By } from '@angular/platform-browser';
import {
  ActionApiResponse,
  ActionType,
  ComponentDto,
  ComponentDtoAction,
  DTOActionAction,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { Observable, of } from 'rxjs';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import { UtilsServiceStub } from '../../../core/services/utils/utils.service.stub';

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
  `,
})
export class ActionTestComponent {
  downloadAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.download,
  };
  prevStepModalAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.prevStepModal,
  };
  nextStepModalAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.nextStepModal,
  };
  skipStepAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.skipStep,
  };
  prevStepAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.prevStep,
  };
  nextStepAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.nextStep,
  };
  redirectToLKAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.redirectToLK,
  };
  profileEditAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.profileEdit,
  };
  homeAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.home,
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDirective, ActionTestComponent],
      providers: [
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
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
    spyOn(navigationService.skipStep, 'next').and.callThrough();
    button.click();

    expect(navigationService.skipStep.next).toHaveBeenCalled();
  });

  it('test directive - nextStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStep')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService.nextStep, 'next').and.callThrough();
    button.click();

    expect(navigationService.nextStep.next).toHaveBeenCalled();
  });

  it('test directive - prevStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStep')).nativeElement;
    fixture.detectChanges();
    spyOn(navigationService.prevStep, 'next').and.callThrough();
    button.click();

    expect(navigationService.prevStep.next).toHaveBeenCalled();
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
});
