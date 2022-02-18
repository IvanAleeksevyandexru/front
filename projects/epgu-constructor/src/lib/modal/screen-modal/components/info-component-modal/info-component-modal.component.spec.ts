import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { ActionType, DTOActionAction, ComponentDto } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  ModalService,
  ModalServiceStub,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ButtonComponent } from '@epgu/ui/base';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ScreenModalServiceStub } from '../../screen-modal.service.stub';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { InfoScreenBodyComponent } from '../../../../screen/info-screen/info-screen-body/info-screen-body.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentsListRelationsService } from '../../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { ComponentsListRelationsServiceStub } from '../../../../component/custom-screen/services/components-list-relations/components-list-relations.service.stub';

describe('InfoComponentModalComponent', () => {
  let component: InfoComponentModalComponent;
  let fixture: ComponentFixture<InfoComponentModalComponent>;

  let navigationModalService: NavigationModalService;
  let screenModalService: ScreenModalService;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScreenButtonsModule, ActionModule],
      declarations: [
        InfoComponentModalComponent,
        MockComponent(ButtonComponent),
        MockComponent(InfoScreenBodyComponent),
        MockDirective(ActionDirective),
      ],
      providers: [
        CertificateEaisdoService,
        EaisdoGroupCostService,
        EventBusService,
        CurrentAnswersService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
      ],
    })
      .overrideComponent(InfoComponentModalComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponentModalComponent);
    component = fixture.componentInstance;

    navigationModalService = TestBed.inject(NavigationModalService);
    screenModalService = TestBed.inject(ScreenModalService);
    screenService = TestBed.inject(ScreenService);
    screenService.buttons = [
      {
        label: 'Вернуться к заявлению',
        type: ActionType.nextStepModal,
        value: 'Вернуться к заявлению',
        action: DTOActionAction.getNextStep,
      },
    ];
    fixture.detectChanges();
  });

  it('should set container element min height', () => {
    const containerEl = fixture.nativeElement.querySelector(':scope > *');

    expect(containerEl.style.minHeight).toBe('0px');

    screenModalService.minContentHeightSubject.next(80);
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

    button = fixture.debugElement.query(By.css('.screen-buttons .screen-button'));
    expect(button).toBeTruthy();

    expect(button.query(By.css('button span')).nativeElement.innerHTML.trim()).toBe(
      screenService.buttons[0].value,
    );

    expect(button.componentInstance.disabled).toBeFalsy();

    screenService.isLoadingSubject.next(true);
    fixture.detectChanges();

    expect(button.componentInstance.disabled).toBeTruthy();
  });
});
