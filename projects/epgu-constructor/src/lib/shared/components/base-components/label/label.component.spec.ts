import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  SafePipe,
  JsonHelperService,
  JsonHelperServiceStub,
  ImgPrefixerPipe,
  ConfigService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { LabelComponent } from './label.component';
import { ClickableLabelDirective } from '../../../directives/clickable-label/clickable-label.directive';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ActionService } from '../../../directives/action/action.service';
import { ActionServiceStub } from '../../../directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { HtmlSelectService } from '../../../../core/services/html-select/html-select.service';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [LabelComponent, SafePipe, ImgPrefixerPipe, ClickableLabelDirective],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        EventBusService,
        CurrentAnswersService,
        SmuEventsService,
        HtmlSelectService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
  });

  it('should open modal if clarifications are set', () => {
    component.label = '<p><a id="test">Ссылка</a></p>';
    component.clarifications = { test: { text: '', title: '' } };
    fixture.detectChanges();

    const span: HTMLDivElement = fixture.debugElement.query(By.css('span')).nativeElement;

    const spy = jest.spyOn(modalService, 'openModal');
    span.querySelector('a').click();
    expect(spy).toHaveBeenCalled();
  });

  describe('div', () => {
    it('should contain html', () => {
      const testText = 'Test text';
      const testHtml = `<p>${testText}</p>`;
      component.label = testHtml;
      fixture.detectChanges();

      const span: HTMLDivElement = fixture.debugElement.query(By.css('span')).nativeElement;

      expect(span.textContent).toContain(testText);
      expect(span.innerHTML).toContain(testHtml);
    });
  });
});
