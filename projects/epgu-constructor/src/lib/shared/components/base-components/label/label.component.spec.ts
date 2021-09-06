import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelComponent } from './label.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  SafePipe
} from '@epgu/epgu-constructor-ui-kit';
import { ImgPrefixerPipe } from '@epgu/epgu-constructor-ui-kit';
import { ClickableLabelDirective } from '../../../directives/clickable-label/clickable-label.directive';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ActionService } from '../../../directives/action/action.service';
import { ActionServiceStub } from '../../../directives/action/action.service.stub';
import { By } from '@angular/platform-browser';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { configureTestSuite } from 'ng-bullet';
import { SmuEventsService } from '@epgu/epgu-lib';
import { HtmlSelectService } from '../../../../core/services/html-select/html-select.service';
import { JsonHelperServiceStub } from '../../../../core/services/json-helper/json-helper.service.stub';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;
  let modalService: ModalService;

  configureTestSuite(() => {
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
    component.clarifications = { test: { text: '', title: '' }};
    fixture.detectChanges();

    const span: HTMLDivElement = fixture.debugElement.query(By.css('span')).nativeElement;

    spyOn(modalService, 'openModal').and.callThrough();
    span.querySelector('a').click();
    expect(modalService.openModal).toHaveBeenCalled();
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
