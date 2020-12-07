import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ScreenModalServiceStub } from '../../screen-modal.service.stub';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { componentDtoSample1 } from '../../../../testing/data-sample/component-dto';
import { componentDtoActionSample1 } from '../../../../testing/data-sample/component-dto-action';
import { MockComponent, MockDirective } from 'ng-mocks';
import { ButtonComponent } from 'epgu-lib';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { InfoScreenBodyComponent } from '../../../../screen/info-screen/info-screen-body/info-screen-body.component';
import { By } from '@angular/platform-browser';

describe('InfoComponentModalComponent', () => {
  let component: InfoComponentModalComponent;
  let fixture: ComponentFixture<InfoComponentModalComponent>;

  let navigationModalService: NavigationModalServiceStub;
  let screenModalService: ScreenModalServiceStub;
  let screenService: ScreenServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InfoComponentModalComponent,
        MockComponent(ButtonComponent),
        MockComponent(InfoScreenBodyComponent),
        MockDirective(ActionDirective),
      ],
      providers: [
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
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
    const el = fixture.debugElement.query(By.css('epgu-constructor-info-screen-body'));

    expect(el).toBeTruthy();

    expect(el.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample1;
    fixture.detectChanges();

    expect(el.componentInstance.data).toBe(componentDtoSample1);
  });

  it('should render lib-button[epgu-constructor-action]', () => {
    let buttons = fixture.debugElement.queryAll(By.css('lib-button[epgu-constructor-action]'));

    expect(buttons.length).toBe(0);

    component.actionButtons = [componentDtoActionSample1];
    fixture.detectChanges();

    buttons = fixture.debugElement.queryAll(By.css('lib-button[epgu-constructor-action]'));
    expect(buttons.length).toBe(1);

    expect(buttons[0].injector.get(ActionDirective).action).toBe(componentDtoActionSample1);
    expect(buttons[0].nativeElement.innerHTML.trim()).toBe(componentDtoActionSample1.label);
  });

  it('should render [data-testid="info-submit-button"] lib-button', () => {
    let button = fixture.debugElement.query(By.css('lib-button[data-testid="info-submit-button"]'));
    expect(button).toBeNull();

    screenService.submitLabel = 'submitLabel1';
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('lib-button[data-testid="info-submit-button"]'));
    expect(button).toBeTruthy();

    expect(button.nativeElement.innerHTML.trim()).toBe(screenService.submitLabel);

    expect(button.componentInstance.showLoader).toBeFalsy();
    expect(button.componentInstance.disabled).toBeFalsy();

    screenService.isLoadingSubject$.next(true);
    fixture.detectChanges();

    expect(button.componentInstance.showLoader).toBeTruthy();
    expect(button.componentInstance.disabled).toBeTruthy();
  });

  it('should call navModalService.next() on [data-testid="info-submit-button"] lib-button click', () => {
    screenService.submitLabel = 'submitLabel1';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'lib-button[data-testid="info-submit-button"]',
    );

    const nextSpy = spyOn(navigationModalService, 'next').and.callThrough();

    button.click();

    expect(nextSpy).toBeCalledTimes(1);
    expect(nextSpy).toBeCalledWith({});
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

      component.nextStep();

      expect(nextSpy).toBeCalledTimes(1);
      expect(nextSpy).toBeCalledWith({});
    });
  });
});
