import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ScreenModalServiceStub } from '../../screen-modal.service.stub';
import { CycledFieldsService } from '../../../../screen/services/cycled-fields/cycled-fields.service';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { CycledFieldsServiceStub } from '../../../../screen/services/cycled-fields/cycled-fields.service.stub';
import { componentDtoSample1 } from '../../../../testing/data-sample/component-dto';
import { navigationPayloadSample1 } from '../../../../testing/data-sample/navigation-payload';
import { componentDtoActionSample1 } from '../../../../testing/data-sample/component-dto-action';

describe('InfoComponentModalComponent', () => {
  let component: InfoComponentModalComponent;
  let fixture: ComponentFixture<InfoComponentModalComponent>;

  let navigationModalService: NavigationModalServiceStub;
  let screenModalService: ScreenModalServiceStub;
  let screenService: ScreenServiceStub;
  let cycledFieldsService: CycledFieldsServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoComponentModalComponent],
      providers: [
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CycledFieldsService, useClass: CycledFieldsServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    navigationModalService = (TestBed.inject(
      NavigationModalService,
    ) as unknown) as NavigationModalServiceStub;
    screenModalService = (TestBed.inject(ScreenModalService) as unknown) as ScreenModalServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    cycledFieldsService = (TestBed.inject(
      CycledFieldsService,
    ) as unknown) as CycledFieldsServiceStub;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set container element min height', () => {
    const containerEl = fixture.nativeElement.querySelector(':scope > *');

    expect(containerEl.style.minHeight).toBe('0px');

    screenModalService.minContentHeightSub$.next(80);
    fixture.detectChanges();

    expect(containerEl.style.minHeight).toBe('80px');
  });

  it('should render epgu-constructor-info-screen-body', () => {
    const el = fixture.nativeElement.querySelector('epgu-constructor-info-screen-body');

    expect(el).toBeTruthy();

    expect(el.data).toBeNull();

    screenService.component = componentDtoSample1;
    fixture.detectChanges();

    expect(el.data).toBe(componentDtoSample1);
  });

  it('should render lib-button[epgu-constructor-action]', () => {
    let buttons = fixture.nativeElement.querySelectorAll('lib-button[epgu-constructor-action]');

    expect(buttons.length).toBe(0);

    component.actionButtons = [componentDtoActionSample1];
    fixture.detectChanges();

    buttons = fixture.nativeElement.querySelectorAll('lib-button[epgu-constructor-action]');
    expect(buttons.length).toBe(1);

    expect(buttons[0].action).toBe(componentDtoActionSample1);
    expect(buttons[0].innerHTML.trim()).toBe(componentDtoActionSample1.label);
  });

  it('should render [data-testid="info-submit-button"] lib-button', () => {
    let button = fixture.nativeElement.querySelector(
      'lib-button[data-testid="info-submit-button"]',
    );
    expect(button).toBeNull();

    screenService.submitLabel = 'submitLabel1';
    fixture.detectChanges();

    button = fixture.nativeElement.querySelector('lib-button[data-testid="info-submit-button"]');
    expect(button).toBeTruthy();

    expect(button.innerHTML.trim()).toBe(screenService.submitLabel);

    expect(button.showLoader).toBeFalsy();
    expect(button.disabled).toBeFalsy();

    screenService.isLoadingSubject$.next(true);
    fixture.detectChanges();

    expect(button.showLoader).toBeTruthy();
    expect(button.disabled).toBeTruthy();
  });

  it('should call navModalService.next() on [data-testid="info-submit-button"] lib-button click', () => {
    screenService.submitLabel = 'submitLabel1';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'lib-button[data-testid="info-submit-button"]',
    );

    const nextSpy = spyOn(navigationModalService, 'next').and.callThrough();
    spyOn(cycledFieldsService, 'dataTransform').and.returnValue(navigationPayloadSample1);

    button.click();

    expect(nextSpy).toBeCalledTimes(1);
    expect(nextSpy).toBeCalledWith({
      payload: navigationPayloadSample1,
    });
  });

  describe('prevStep() method', () => {
    it('should call navModalService.prev()', () => {
      const spy = spyOn(navigationModalService, 'prev').and.callThrough();

      component.prevStep();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({});
    });
  });

  describe('nextStep() method', () => {
    it('should call navModalService.next()', () => {
      const nextSpy = spyOn(navigationModalService, 'next').and.callThrough();
      spyOn(cycledFieldsService, 'dataTransform').and.returnValue(navigationPayloadSample1);

      component.nextStep();

      expect(nextSpy).toBeCalledTimes(1);
      expect(nextSpy).toBeCalledWith({
        payload: navigationPayloadSample1,
      });
    });
  });
});
