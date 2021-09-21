import { ClickableLabelDirective } from './clickable-label.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
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
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ActionService } from '../action/action.service';
import { ActionServiceStub } from '../action/action.service.stub';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../core/services/html-select/html-select.service';
import { JsonHelperServiceStub } from '../../../core/services/json-helper/json-helper.service.stub';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { SmuEventsService } from '@epgu/ui/services/smu-events';

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
  constructor() {}
}

describe('ClickableLabelDirective', () => {
  let fixture: ComponentFixture<LabelTestComponent>;
  let component: LabelTestComponent;
  let modalService: ModalService;
  let actionService: ActionService;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ClickableLabelDirective, LabelTestComponent, SafePipe, ImgPrefixerPipe],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
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
  });

  it('should open modal if clarifications are set', () => {
    component.label = '<p><a id="test">Ссылка</a></p>';
    component.clarifications = { test: { text: '', title: '' }};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(modalService, 'openModal').and.callThrough();
    div.querySelector('a').click();
    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should not open modal if clarifications are not set', () => {
    component.label = '<p><a id="test">Ссылка</a></p>';
    component.clarifications = undefined; //{ test: { text: '', title: '' }};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(modalService, 'openModal').and.callThrough();
    div.querySelector('a').click();
    expect(modalService.openModal).not.toHaveBeenCalled();
  });

  it('should not open modal if clicked element without clarifications', () => {
    component.label = '<p><a id="test">Ссылка</a></p>';
    component.clarifications = { test: { text: '', title: '' }};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(modalService, 'openModal').and.callThrough();
    div.querySelector('p').click();
    expect(modalService.openModal).not.toHaveBeenCalled();
  });

  it('should call _handleAction if target element is ActionType', () => {
    screenService.component = {
      attrs: {},
      id: 'test1',
      type: 'Lookup',
    };
    component.label = '<p><a data-action-type="nextStep" data-action-value=0>Ссылка</a></p>';
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(actionService, 'switchAction').and.callThrough();
    div.querySelector('a').click();
    expect(actionService.switchAction).toHaveBeenCalled();
  });

  it('should not set _currentAnswersService.state if target ActionType is deleteSuggest', () => {
    screenService.component = {
      attrs: {},
      id: 'test1',
      type: 'Lookup',
    };
    component.label = '<p><a data-action-type="deleteSuggest" data-action-value=0>Ссылка</a></p>';
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    div.querySelector('a').click();
    expect(currentAnswersService.state).toBeUndefined();
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
