import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Clarifications } from '@epgu/epgu-constructor-types';
import {
  UnsubscribeService,
  ConfigService,
  ConfigServiceStub,
  ImgPrefixerPipe,
  SafePipe,
  ModalService,
  ModalServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  JsonHelperService,
  JsonHelperServiceStub,
  EventBusService,
  BusEventType,
} from '@epgu/epgu-constructor-ui-kit';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { ClickableLabelDirective } from './clickable-label.directive';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ActionService } from '../action/action.service';
import { ActionServiceStub } from '../action/action.service.stub';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../core/services/html-select/html-select.service';

@Component({
  selector: 'epgu-constructor-label-test-component',
  template: `<div
    epgu-constructor-clickable-label
    [innerHTML]="label | imgPrefixer | safe: 'html'"
    [clarifications]="clarifications"
  ></div>`,
  providers: [UnsubscribeService],
})
class LabelTestComponent {
  public label;

  public clarifications: Clarifications;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
  constructor() {}
}

describe('ClickableLabelDirective', () => {
  let fixture: ComponentFixture<LabelTestComponent>;
  let component: LabelTestComponent;
  let modalService: ModalService;
  let actionService: ActionService;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;
  let eventBusService: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClickableLabelDirective, LabelTestComponent, SafePipe, ImgPrefixerPipe],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        JsonHelperService,
        EventBusService,
        CurrentAnswersService,
        SmuEventsService,
        HtmlSelectService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTestComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    actionService = TestBed.inject(ActionService);
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    eventBusService = TestBed.inject(EventBusService);
    screenService.component = {
      attrs: {},
      id: 'test1',
      type: 'Lookup',
    };
  });

  it('should open modal if clarifications are set', () => {
    component.label = '<p><a id="test">????????????</a></p>';
    component.clarifications = { test: { text: '', title: '' } };
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    const spy = jest.spyOn(modalService, 'openModal');
    div.querySelector('a').click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not open modal if clarifications are not set', () => {
    component.label = '<p><a id="test">????????????</a></p>';
    component.clarifications = undefined; // { test: { text: '', title: '' }};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    const spy = jest.spyOn(modalService, 'openModal');
    div.querySelector('a').click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not open modal if clicked element without clarifications', () => {
    component.label = '<p><a id="test">????????????</a></p>';
    component.clarifications = { test: { text: '', title: '' } };
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    const spy = jest.spyOn(modalService, 'openModal');
    div.querySelector('p').click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call _handleAction if target element is ActionType', () => {
    component.label = '<p><a data-action-type="nextStep" data-action-value=0>????????????</a></p>';
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    const spy = jest.spyOn(actionService, 'switchAction');
    div.querySelector('a').click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not set _currentAnswersService.state if target ActionType is deleteSuggest', () => {
    component.label = '<p><a data-action-type="deleteSuggest" data-action-value=0>????????????</a></p>';
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    div.querySelector('a').click();
    expect(currentAnswersService.state).toBeUndefined();
  });

  it('should eventBusService.emit CloseModalEventGlobal event when needToCloseModal in attrs', () => {
    const spy = jest.spyOn(eventBusService, 'emit');
    component.label =
      "<p><a data-action-attrs='{\"needToCloseModal\":true}' data-action-type='prevStep'>????????????</a></p>";
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    div.querySelector('a').click();
    expect(spy).toHaveBeenCalledWith(BusEventType.CloseModalEventGlobal);
  });

  describe('div', () => {
    it('should contain label', () => {
      const labelText = 'Test label';
      const labelHtml = `<p>${labelText}</p>`;
      component.label = labelHtml;
      fixture.detectChanges();
      const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;

      expect(div.innerHTML).toContain(labelHtml);
      expect(div.textContent).toContain(labelText);
    });
  });
});
