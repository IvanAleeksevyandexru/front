import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutputHtmlComponent } from './output-html.component';
import { ModalService } from '../../../modal/modal.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImgPrefixerPipe } from '../../pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from '../../pipes/safe/safe.pipe';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ActionService } from '../../directives/action/action.service';
import { ActionServiceStub } from '../../directives/action/action.service.stub';
import { ClickableLabelDirective } from '../../directives/clickable-label/clickable-label.directive';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

describe('OutputHtmlComponent', () => {
  let fixture: ComponentFixture<OutputHtmlComponent>;
  let component: OutputHtmlComponent;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImgPrefixerPipe, SafePipe, OutputHtmlComponent, ClickableLabelDirective],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OutputHtmlComponent);
        component = fixture.componentInstance;
        modalService = TestBed.inject(ModalService);
      });
  });

  it('should open modal if clarifications are set', () => {
    component.html = '<p><a id="test">Ссылка</a></p>';
    component.clarifications = { test: { text: '', title: '' }};
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;
    spyOn(modalService, 'openModal').and.callThrough();
    div.querySelector('a').click();
    expect(modalService.openModal).toHaveBeenCalled();
  });

  describe('div', () => {
    it('should contain html', () => {
      const testText = 'Test text';
      const testHtml = `<p>${testText}</p>`;
      component.html = testHtml;
      fixture.detectChanges();

      const div: HTMLDivElement = fixture.debugElement.query(By.css('div')).nativeElement;

      expect(div.textContent).toContain(testText);
      expect(div.innerHTML).toContain(testHtml);
    });
  });
});
