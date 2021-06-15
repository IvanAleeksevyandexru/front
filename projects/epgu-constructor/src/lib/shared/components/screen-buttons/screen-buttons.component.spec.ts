import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';

import { ScreenButtonsComponent } from './screen-buttons.component';
import { BaseModule } from '../../base.module';
import { DisabledButtonPipe } from './pipes/disabled-button.pipe';
import { ShowLoaderButtonPipe } from './pipes/show-loader-button.pipe';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ActionService } from '../../directives/action/action.service';
import { ActionServiceStub } from '../../directives/action/action.service.stub';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ActionType, DTOActionAction } from '@epgu/epgu-constructor-types';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';

describe('ScreenButtonsComponent', () => {
  let component: ScreenButtonsComponent;
  let fixture: ComponentFixture<ScreenButtonsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BaseModule],
      declarations: [ScreenButtonsComponent, DisabledButtonPipe, ShowLoaderButtonPipe],
      providers: [
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        CurrentAnswersService,
        EventBusService,
      ],
    })
      .overrideComponent(ScreenButtonsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenButtonsComponent);
    component = fixture.componentInstance;
    component.screenButtons = [
      {
        action: DTOActionAction.redirect,
        type: ActionType.home,
        label: 'На главную',
      },
      {
        action: DTOActionAction.getNextStep,
        type: ActionType.nextStep,
        label: 'Далее',
      },
    ];
    fixture.detectChanges();
  });

  it('should render two buttons', () => {
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));
    expect(debugElements.length).toBe(2);
  });

  it('should render one button', () => {
    component.screenButtons = [
      {
        action: DTOActionAction.getNextStep,
        type: ActionType.nextStep,
        label: 'Далее',
      },
    ];
    fixture.detectChanges();
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));
    expect(debugElements.length).toBe(1);
  });

  it('should have button labels', () => {
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));
    expect(debugElements[0].nativeElement.textContent.trim()).toBe('На главную');
    expect(debugElements[1].nativeElement.textContent.trim()).toBe('Далее');
  });

  it('should call setClickedButton when click on button and set clickedButton', () => {
    const setClickedButtonSpy = jest.spyOn(component, 'setClickedButton');
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));
    debugElements[0].nativeElement.click();
    expect(setClickedButtonSpy).toBeCalledWith(component.screenButtons[0]);
    expect(component.clickedButton).toBe(component.screenButtons[0]);
  });

  it('should disable all buttons when isLoading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));
    expect(debugElements[0].nativeElement.disabled).toBeTruthy();
    expect(debugElements[1].nativeElement.disabled).toBeTruthy();
  });

  it('should add loaded class for clickedButton', () => {
    component.isLoading = true;
    component.clickedButton = component.screenButtons[1];
    fixture.detectChanges();
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));
    expect(debugElements[0].classes['loader']).toBeFalsy();
    expect(debugElements[1].classes['loader']).toBeTruthy();
  });

  it('should disable all buttons when disabled and disabledForAll', () => {
    component.isLoading = false;
    component.disabled = true;
    component.disabledForAll = true;
    fixture.detectChanges();
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));
    expect(debugElements[0].nativeElement.disabled).toBeTruthy();
    expect(debugElements[1].nativeElement.disabled).toBeTruthy();
  });

  it('should disable only for next screen buttons when disabled and not disabledForAll', () => {
    component.isLoading = false;
    component.disabled = true;
    component.disabledForAll = false;
    fixture.detectChanges();
    let debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));
    expect(debugElements[0].nativeElement.disabled).toBeFalsy();
    expect(debugElements[1].nativeElement.disabled).toBeTruthy();
  });
});
