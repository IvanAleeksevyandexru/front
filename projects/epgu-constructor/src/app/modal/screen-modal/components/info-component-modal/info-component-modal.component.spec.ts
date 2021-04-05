import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ScreenModalServiceStub } from '../../screen-modal.service.stub';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { MockComponent, MockDirective } from 'ng-mocks';
import { ButtonComponent } from 'epgu-lib';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { InfoScreenBodyComponent } from '../../../../screen/info-screen/info-screen-body/info-screen-body.component';
import { By } from '@angular/platform-browser';
import { ActionType, ComponentDto, DTOActionAction, } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ChangeDetectionStrategy } from '@angular/core';

describe('InfoComponentModalComponent', () => {
  let component: InfoComponentModalComponent;
  let fixture: ComponentFixture<InfoComponentModalComponent>;

  let navigationModalService: NavigationModalService;
  let screenModalService: ScreenModalService;
  let screenService: ScreenService;

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
    }).overrideComponent(InfoComponentModalComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponentModalComponent);
    component = fixture.componentInstance;

    navigationModalService = TestBed.inject(NavigationModalService,);
    screenModalService = TestBed.inject(ScreenModalService);
    screenService = TestBed.inject(ScreenService);
    screenService.buttons = [{
      label: 'Вернуться к заявлению',
      type: ActionType.nextStepModal,
      value: 'Вернуться к заявлению',
      action: DTOActionAction.getNextStep
    }];
    fixture.detectChanges();
  });

  it('should set container element min height', () => {
    const containerEl = fixture.nativeElement.querySelector(':scope > *');

    expect(containerEl.style.minHeight).toBe('0px');

    screenModalService['minContentHeightSubject'].next(80);
    fixture.detectChanges();

    expect(containerEl.style.minHeight).toBe('80px');
  });

  it('should render epgu-constructor-info-screen-body', () => {
    const el = fixture.debugElement.query(By.css('epgu-constructor-info-screen-body'));

    expect(el).toBeTruthy();

    expect(el.componentInstance.data).toBeNull();

    const componentDtoSample: ComponentDto = {
      attrs: {},
      id: 'id1',
      label: 'label1',
      type: 'type1',
      value: 'value1',
    };

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(el.componentInstance.data).toBe(componentDtoSample);
  });

  it('should render [data-testid="info-submit-button"] lib-button', () => {
    let button = fixture.debugElement.query(By.css('lib-button[data-testid="info-submit-button"]'));
    expect(button).toBeNull();

    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('.submit-button'));
    expect(button).toBeTruthy();

    expect(button.nativeElement.innerHTML.trim()).toBe(screenService.buttons[0].value);

    expect(button.componentInstance.showLoader).toBeFalsy();
    expect(button.componentInstance.disabled).toBeFalsy();

    screenService['isLoadingSubject'].next(true);
    fixture.detectChanges();

    expect(button.componentInstance.showLoader).toBeTruthy();
    expect(button.componentInstance.disabled).toBeTruthy();
  });
});
