import { inject, TestBed, ComponentFixture } from '@angular/core/testing';

import { ActionDirective } from './action.directive';

import { ActionTestComponent } from './action-test.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from './stubs/form-player-api.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from './stubs/navigation.service.stub';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from './stubs/navigation-modal.service.stub';
import { UtilsServiceStub } from './stubs/utils.service.stub';
import { UtilsService } from '../../services/utils/utils.service';
import { By } from '@angular/platform-browser';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';

const mockComponent: ComponentDto = {
  attrs: {},
  label: '',
  type: '',
  id: '12',
  value: '',
};

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
      });
  });

  it('should create an instance', inject(
    [FormPlayerApiService, ScreenService, NavigationService, NavigationModalService, UtilsService],
    (
      formPlayerApiService: FormPlayerApiService,
      screenService: ScreenService,
      navigationService: NavigationService,
      navigationModalService: NavigationModalService,
      utilsService: UtilsService,
    ) => {
      const directive = new ActionDirective(
        formPlayerApiService,
        screenService,
        navigationService,
        navigationModalService,
        utilsService,
      );
      expect(directive).toBeTruthy();
    },
  ));

  it('test directive - download action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.download')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(utilsService, 'downloadFile');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('test directive - prevStepModal Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStepModal')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationModalService, 'prev');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - nextStepModal Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStepModal')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationModalService, 'next');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - skipStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.skipStep')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService.skipStep, 'next');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - nextStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.nextStep')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService.nextStep, 'next');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - prevStep Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.prevStep')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService.prevStep, 'next');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - redirectToLK Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.redirectToLK')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'redirectToLK');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - profileEdit Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.profileEdit')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'redirectToProfileEdit');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('test directive - home Action', () => {
    const button: HTMLElement = fixture.debugElement.query(By.css('.home')).nativeElement;
    fixture.detectChanges();
    const spy = jest.spyOn(navigationService, 'redirectToHome');
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
